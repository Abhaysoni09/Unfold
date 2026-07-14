import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Check, MapPin, Plus, Home, Briefcase } from "lucide-react";
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

const Checkout = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [savingAddress, setSavingAddress] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [cartRes, addressRes] = await Promise.all([
        axios.get(`http://localhost:3000/api/cart`, { withCredentials: true }),
        axios.get(`http://localhost:3000/api/address`, { withCredentials: true }),
      ]);

      setCart(cartRes.data.cart);
      setAddresses(addressRes.data.addresses || []);

      const defaultAddr = (addressRes.data.addresses || []).find((a) => a.isdefault);
      if (defaultAddr) setSelectedAddressId(defaultAddr._id);
      else if (addressRes.data.addresses?.length) {
        setSelectedAddressId(addressRes.data.addresses[0]._id);
      }
    } catch (err) {
      console.log(err.response?.data || err);
      setError("Could not load checkout details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleAddAddress = async () => {
    setError("");
    const required = ["fullname", "phone", "house", "area", "city", "state", "pincode"];
    if (required.some((f) => !form[f]?.trim())) {
      setError("Please fill in all required address fields.");
      return;
    }

    try {
      setSavingAddress(true);
      const res = await axios.post(`http://localhost:3000/api/address`, form, { withCredentials: true });
      setAddresses((prev) => [res.data.address, ...prev]);
      setSelectedAddressId(res.data.address._id);
      setShowAddForm(false);
      setForm(emptyForm);
    } catch (err) {
      console.log(err.response?.data || err);
      setError(err.response?.data?.message || "Could not save address.");
    } finally {
      setSavingAddress(false);
    }
  };

  const handlePlaceOrder = async () => {
    setError("");
    if (!selectedAddressId) {
      setError("Please select a delivery address.");
      return;
    }

    try {
      setPlacing(true);
      const res = await axios.post(
        `http://localhost:3000/api/order`,
        { addressId: selectedAddressId, paymentMethod },
        { withCredentials: true }
      );
      console.log(res.data.order._id)
      navigate(`/confirmorder/${res.data.order._id}`);
    } catch (err) {
      console.log(err.response?.data || err);
      setError(err.response?.data?.message || "Could not place order.");
    } finally {
      setPlacing(false);
    }
  };

  const typeIcon = (type) => {
    if (type === "Office") return <Briefcase size={14} />;
    if (type === "Other") return <MapPin size={14} />;
    return <Home size={14} />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EBF3EC] flex items-center justify-center">
        <p className="text-[#235347]">Loading checkout...</p>
      </div>
    );
  }

  const items = cart?.items || [];

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#EBF3EC] flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-2xl font-semibold text-[#051F20]">Your cart is empty</h2>
        <p className="text-gray-500 mt-2">Add some products before checking out.</p>
        <Link to="/products">
          <button className="mt-6 bg-[#163832] hover:bg-[#0B2B26] text-white px-8 py-3 rounded-xl transition">
            Browse Products
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EBF3EC] px-6 py-10 md:px-16">
      <h1 className="text-4xl font-bold text-[#051F20] mb-10">Checkout</h1>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-300 text-red-700 rounded-xl p-3 text-sm max-w-3xl">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold text-[#051F20]">
                Delivery Address
              </h2>
              <button
                onClick={() => setShowAddForm((prev) => !prev)}
                className="flex items-center gap-1 text-sm font-medium text-[#235347] hover:text-[#163832]"
              >
                <Plus size={16} />
                Add New
              </button>
            </div>

            {addresses.length === 0 && !showAddForm && (
              <p className="text-gray-500 text-sm">
                No saved addresses. Add one to continue.
              </p>
            )}

            <div className="space-y-3">
              {addresses.map((address) => (
                <label
                  key={address._id}
                  className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition ${
                    selectedAddressId === address._id
                      ? "border-[#235347] bg-[#EBF3EC]"
                      : "border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="selectedAddress"
                    checked={selectedAddressId === address._id}
                    onChange={() => setSelectedAddressId(address._id)}
                    className="mt-1 accent-[#235347]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[#051F20]">
                        {address.fullname}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-[#235347] bg-white px-2 py-0.5 rounded-full border border-[#8EB69B]">
                        {typeIcon(address.addresstype)}
                        {address.addresstype}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{address.phone}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {address.house}, {address.area}, {address.city}, {address.state} -{" "}
                      {address.pincode}
                    </p>
                  </div>
                </label>
              ))}
            </div>

            {showAddForm && (
              <div className="mt-6 border-t border-[#EBF3EC] pt-6 grid md:grid-cols-2 gap-4">
                <input
                  name="fullname"
                  value={form.fullname}
                  onChange={handleFormChange}
                  placeholder="Full Name"
                  className="rounded-xl border border-[#8EB69B] p-3 outline-none focus:ring-2 focus:ring-[#235347]"
                />
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleFormChange}
                  placeholder="Phone"
                  className="rounded-xl border border-[#8EB69B] p-3 outline-none focus:ring-2 focus:ring-[#235347]"
                />
                <input
                  name="house"
                  value={form.house}
                  onChange={handleFormChange}
                  placeholder="House / Flat / Building"
                  className="md:col-span-2 rounded-xl border border-[#8EB69B] p-3 outline-none focus:ring-2 focus:ring-[#235347]"
                />
                <input
                  name="area"
                  value={form.area}
                  onChange={handleFormChange}
                  placeholder="Area / Street"
                  className="md:col-span-2 rounded-xl border border-[#8EB69B] p-3 outline-none focus:ring-2 focus:ring-[#235347]"
                />
                <input
                  name="city"
                  value={form.city}
                  onChange={handleFormChange}
                  placeholder="City"
                  className="rounded-xl border border-[#8EB69B] p-3 outline-none focus:ring-2 focus:ring-[#235347]"
                />
                <input
                  name="state"
                  value={form.state}
                  onChange={handleFormChange}
                  placeholder="State"
                  className="rounded-xl border border-[#8EB69B] p-3 outline-none focus:ring-2 focus:ring-[#235347]"
                />
                <input
                  name="pincode"
                  value={form.pincode}
                  onChange={handleFormChange}
                  placeholder="Pincode"
                  className="rounded-xl border border-[#8EB69B] p-3 outline-none focus:ring-2 focus:ring-[#235347]"
                />
                <input
                  name="landmark"
                  value={form.landmark}
                  onChange={handleFormChange}
                  placeholder="Landmark (optional)"
                  className="rounded-xl border border-[#8EB69B] p-3 outline-none focus:ring-2 focus:ring-[#235347]"
                />

                <div className="md:col-span-2 flex justify-end gap-3 mt-2">
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="border border-[#8EB69B] text-[#051F20] px-5 py-2.5 rounded-xl hover:bg-[#EBF3EC] transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddAddress}
                    disabled={savingAddress}
                    className="bg-[#163832] hover:bg-[#0B2B26] disabled:opacity-50 text-white px-5 py-2.5 rounded-xl transition"
                  >
                    {savingAddress ? "Saving..." : "Save Address"}
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-[#051F20] mb-5">
              Payment Method
            </h2>
            <div className="flex gap-4">
              {["COD", "Online"].map((method) => (
                <label
                  key={method}
                  className={`flex-1 flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition ${
                    paymentMethod === method
                      ? "border-[#235347] bg-[#EBF3EC]"
                      : "border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                    className="accent-[#235347]"
                  />
                  <span className="font-medium text-[#051F20]">
                    {method === "COD" ? "Cash on Delivery" : "Pay Online"}
                  </span>
                </label>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-[#051F20] mb-5">
              Order Items ({items.length})
            </h2>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item._id} className="flex gap-4 items-center">
                  <img
                    src={item.product?.images?.[0]}
                    alt={item.product?.title}
                    className="w-16 h-16 rounded-lg object-cover bg-[#EBF3EC]"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-[#051F20]">{item.product?.title}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                      {item.selectedColor && ` · ${item.selectedColor}`}
                      {item.selectedSize && ` · ${item.selectedSize}`}
                    </p>
                  </div>
                  <p className="font-semibold text-[#051F20]">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 h-fit sticky top-8">
          <h2 className="text-xl font-semibold text-[#051F20] mb-6">
            Order Summary
          </h2>

          <div className="flex justify-between text-gray-500 text-sm mb-3">
            <span>Subtotal</span>
            <span>₹{(cart?.totalPrice || 0).toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between text-gray-500 text-sm mb-3">
            <span>Shipping</span>
            <span>Free</span>
          </div>

          <div className="border-t border-[#EBF3EC] my-5" />

          <div className="flex justify-between mb-6">
            <span className="font-semibold text-[#051F20]">Total</span>
            <span className="font-bold text-[#051F20] text-lg">
              ₹{(cart?.totalPrice || 0).toLocaleString("en-IN")}
            </span>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={placing || !selectedAddressId}
            className="w-full flex items-center justify-center gap-2 bg-[#163832] hover:bg-[#0B2B26] disabled:opacity-50 text-white py-3 rounded-xl transition"
          >
            <Check size={18} />
            {placing ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;