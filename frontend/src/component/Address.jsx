import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Check, Home, Briefcase, MapPin } from "lucide-react";
import axios from "axios";

const emptyForm = {
  fullname: "",
  phone: "",
  house: "",
  area: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
  landmark: "",
  addresstype: "Home",
  isdefault: false,
};

const Address = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:3000/api/address`, { withCredentials: true });
      setAddresses(res.data.addresses || []);
    } catch (err) {
      console.log(err.response?.data || err);
      setError("Could not load your addresses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const openAddForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (address) => {
    setForm({
      fullname: address.fullname || "",
      phone: address.phone || "",
      house: address.house || "",
      area: address.area || "",
      city: address.city || "",
      state: address.state || "",
      pincode: address.pincode || "",
      country: address.country || "India",
      landmark: address.landmark || "",
      addresstype: address.addresstype || "Home",
      isdefault: address.isdefault || false,
    });
    setEditingId(address._id);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  };

  const handleSave = async () => {
    setError("");

    const required = ["fullname", "phone", "house", "area", "city", "state", "pincode"];
    const missing = required.some((field) => !form[field]?.trim());
    if (missing) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setSaving(true);
      if (editingId) {
        await axios.put(`http://localhost:3000/api/address/${editingId}`, form, { withCredentials: true });
      } else {
        await axios.post(`http://localhost:3000/api/address`, form, { withCredentials: true });
      }
      closeForm();
      fetchAddresses();
    } catch (err) {
      console.log(err.response?.data || err);
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this address?")) return;
    try {
      await axios.delete(`/address/${id}`, { withCredentials: true });
      setAddresses((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.log(err.response?.data || err);
    }
  };

  const setDefault = async (id) => {
    try {
      await axios.patch(`http://localhost:3000/api/address/${id}/default`, {}, { withCredentials: true });
      fetchAddresses();
    } catch (err) {
      console.log(err.response?.data || err);
    }
  };

  const typeIcon = (type) => {
    if (type === "Office") return <Briefcase size={16} />;
    if (type === "Other") return <MapPin size={16} />;
    return <Home size={16} />;
  };

  return (
    <div className="min-h-screen bg-[#EBF3EC] px-6 py-10 md:px-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-[#051F20]">Saved Addresses</h1>
          <p className="text-[#235347] mt-2">Manage where your orders get delivered.</p>
        </div>

        <button
          onClick={openAddForm}
          className="flex items-center gap-2 bg-[#163832] hover:bg-[#0B2B26] text-white px-6 py-3 rounded-xl transition"
        >
          <Plus size={18} />
          Add Address
        </button>
      </div>

      {loading ? (
        <p className="text-[#235347]">Loading addresses...</p>
      ) : addresses.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-xl p-16 flex flex-col items-center justify-center text-center">
          <MapPin className="text-[#8EB69B]" size={56} />
          <h2 className="text-2xl font-semibold text-[#051F20] mt-6">
            No addresses saved yet
          </h2>
          <p className="text-gray-500 mt-2">
            Add an address so we know where to deliver your orders.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {addresses.map((address) => (
            <div
              key={address._id}
              className={`bg-white rounded-2xl shadow-sm p-6 border-2 transition ${
                address.isdefault ? "border-[#235347]" : "border-transparent"
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="flex items-center gap-2 text-sm font-medium text-[#235347] bg-[#EBF3EC] px-3 py-1 rounded-full">
                  {typeIcon(address.addresstype)}
                  {address.addresstype}
                </span>

                {address.isdefault && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-[#163832]">
                    <Check size={14} /> Default
                  </span>
                )}
              </div>

              <h3 className="font-semibold text-[#051F20]">{address.fullname}</h3>
              <p className="text-sm text-gray-500 mt-1">{address.phone}</p>

              <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                {address.house}, {address.area}
                {address.landmark && `, ${address.landmark}`}
                <br />
                {address.city}, {address.state} - {address.pincode}
                <br />
                {address.country}
              </p>

              <div className="flex items-center gap-4 mt-5">
                {!address.isdefault && (
                  <button
                    onClick={() => setDefault(address._id)}
                    className="text-sm text-[#235347] hover:text-[#163832] font-medium"
                  >
                    Set as default
                  </button>
                )}

                <div className="flex-1" />

                <button
                  onClick={() => openEditForm(address)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Pencil size={16} />
                </button>

                <button
                  onClick={() => handleDelete(address._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-[#051F20] mb-6">
              {editingId ? "Edit Address" : "Add New Address"}
            </h2>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-300 text-red-700 rounded-xl p-3 text-sm">
                {error}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="font-medium text-[#051F20]">Full Name</label>
                <input
                  name="fullname"
                  value={form.fullname}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-[#8EB69B] p-3 outline-none focus:ring-2 focus:ring-[#235347]"
                />
              </div>

              <div>
                <label className="font-medium text-[#051F20]">Phone</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-[#8EB69B] p-3 outline-none focus:ring-2 focus:ring-[#235347]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="font-medium text-[#051F20]">House / Flat / Building</label>
                <input
                  name="house"
                  value={form.house}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-[#8EB69B] p-3 outline-none focus:ring-2 focus:ring-[#235347]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="font-medium text-[#051F20]">Area / Street</label>
                <input
                  name="area"
                  value={form.area}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-[#8EB69B] p-3 outline-none focus:ring-2 focus:ring-[#235347]"
                />
              </div>

              <div>
                <label className="font-medium text-[#051F20]">City</label>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-[#8EB69B] p-3 outline-none focus:ring-2 focus:ring-[#235347]"
                />
              </div>

              <div>
                <label className="font-medium text-[#051F20]">State</label>
                <input
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-[#8EB69B] p-3 outline-none focus:ring-2 focus:ring-[#235347]"
                />
              </div>

              <div>
                <label className="font-medium text-[#051F20]">Pincode</label>
                <input
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-[#8EB69B] p-3 outline-none focus:ring-2 focus:ring-[#235347]"
                />
              </div>

              <div>
                <label className="font-medium text-[#051F20]">Country</label>
                <input
                  name="country"
                  value={form.country}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-[#8EB69B] p-3 outline-none focus:ring-2 focus:ring-[#235347]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="font-medium text-[#051F20]">Landmark (optional)</label>
                <input
                  name="landmark"
                  value={form.landmark}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-[#8EB69B] p-3 outline-none focus:ring-2 focus:ring-[#235347]"
                />
              </div>

              <div>
                <label className="font-medium text-[#051F20]">Address Type</label>
                <select
                  name="addresstype"
                  value={form.addresstype}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-[#8EB69B] p-3"
                >
                  <option value="Home">Home</option>
                  <option value="Office">Office</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex items-center gap-3 mt-8">
                <input
                  type="checkbox"
                  name="isdefault"
                  checked={form.isdefault}
                  onChange={handleChange}
                  id="isdefault"
                  className="w-5 h-5 accent-[#235347]"
                />
                <label htmlFor="isdefault" className="font-medium text-[#051F20]">
                  Set as default address
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={closeForm}
                className="border border-[#8EB69B] text-[#051F20] px-6 py-3 rounded-xl hover:bg-[#EBF3EC] transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-[#163832] hover:bg-[#0B2B26] disabled:opacity-50 text-white px-6 py-3 rounded-xl transition"
              >
                {saving ? "Saving..." : editingId ? "Save Changes" : "Add Address"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Address;