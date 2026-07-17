import { Upload, X, Pencil, Trash2, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { API_URL } from "../config/api";

const Createbrand = () => {
  const fileInputRef = useRef(null);
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    status: true,
  });

  const [brands, setBrands] = useState([]);
  const [fetching, setFetching] = useState(true);

  const fetchBrands = async () => {
    try {
      setFetching(true);
      const res = await axios.get(`${API_URL}/brands`,{
        withCredentials:true
      });
      setBrands(res.data.brands || []);
    } catch (err) {
      console.log(err.response?.data || err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) setLogo(file);
  };

  const removeLogo = () => {
    setLogo(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const resetForm = () => {
    setForm({ name: "", description: "", status: true });
    removeLogo();
  };

  const createBrand = async () => {
    setError("");

    if (!form.name.trim()) {
      setError("Brand name is required.");
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name.trim());
    formData.append("description", form.description.trim());
    formData.append("status", form.status);
    if (logo) formData.append("logo", logo);

    try {
      setLoading(true);
      await axios.post(`${API_URL}/brands`, formData,{
        withCredentials:true
      });
      resetForm();
      fetchBrands();
    } catch (err) {
      console.log(err.response?.data || err);
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (brand) => {
    try {
      await axios.patch(`${API_URL}/brands/${brand._id}`,{
        status: !brand.status,
      }, {
        withCredentials:true
      });
      setBrands((prev) =>
        prev.map((b) =>
          b._id === brand._id ? { ...b, status: !b.status } : b
        )
      );
    } catch (err) {
      console.log(err.response?.data || err);
    }
  };

  const deleteBrand = async (id) => {
    if (!window.confirm("Delete this brand? This cannot be undone.")) return;
    try {
      await axios.delete(`${API_URL}/brands/${id}`,{
        withCredentials:true
      });
      setBrands((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      console.log(err.response?.data || err);
    }
  };

  return (
    <div className="min-h-screen bg-[#EBF3EC] p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#051F20]">Brands</h1>
        <p className="text-[#235347] mt-2">
          Manage the brands sold on your UNFOLD store.
        </p>
      </div>
      <div className="bg-white rounded-3xl shadow-xl p-8 mb-10">
        <h2 className="text-xl font-semibold text-[#051F20] mb-6">
          Add New Brand
        </h2>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-300 text-red-700 rounded-xl p-3 text-sm">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="font-medium text-[#051F20]">
                Brand Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="UNFOLD"
                className="mt-2 w-full rounded-xl border border-[#8EB69B] p-3 outline-none focus:ring-2 focus:ring-[#235347]"
              />
            </div>

            <div>
              <label className="font-medium text-[#051F20]">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="4"
                placeholder="A short line about this brand..."
                className="mt-2 w-full rounded-xl border border-[#8EB69B] p-3 outline-none focus:ring-2 focus:ring-[#235347]"
              />
            </div>

            <div className="flex items-center gap-3">
              <label className="font-medium text-[#051F20]">Active</label>
              <button
                type="button"
                onClick={() =>
                  setForm((prev) => ({ ...prev, status: !prev.status }))
                }
                className={`w-12 h-7 rounded-full transition relative ${
                  form.status ? "bg-[#235347]" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                    form.status ? "left-6" : "left-1"
                  }`}
                />
              </button>
            </div>
          </div>

          <div>
            <label className="font-medium text-[#051F20]">Brand Logo</label>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleLogoChange}
            />

            {!logo ? (
              <div
                onClick={() => fileInputRef.current.click()}
                className="mt-2 h-48 rounded-2xl border-2 border-dashed border-[#8EB69B] flex flex-col items-center justify-center bg-[#EBF3EC] cursor-pointer hover:bg-[#dce8df] transition"
              >
                <Upload className="text-[#235347]" size={40} />
                <p className="mt-3 text-[#235347] font-semibold">
                  Click to Upload Logo
                </p>
                <p className="text-sm text-gray-500">PNG, JPG, JPEG</p>
              </div>
            ) : (
              <div className="mt-2 h-48 relative rounded-2xl border border-[#8EB69B] overflow-hidden bg-[#EBF3EC] flex items-center justify-center">
                <img
                  src={URL.createObjectURL(logo)}
                  alt="logo preview"
                  className="max-h-full max-w-full object-contain"
                />
                <button
                  type="button"
                  onClick={removeLogo}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-10">
          <button
            onClick={createBrand}
            disabled={loading}
            className="bg-[#163832] hover:bg-[#0B2B26] disabled:opacity-50 text-white px-8 py-3 rounded-xl transition"
          >
            {loading ? "Adding..." : "Add Brand"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h2 className="text-xl font-semibold text-[#051F20] mb-6">
          All Brands
        </h2>

        {fetching ? (
          <p className="text-[#235347]">Loading brands...</p>
        ) : brands.length === 0 ? (
          <p className="text-gray-500">No brands yet. Add your first one above.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#8EB69B] text-[#051F20]">
                  <th className="py-3 pr-4 font-medium">Logo</th>
                  <th className="py-3 pr-4 font-medium">Name</th>
                  <th className="py-3 pr-4 font-medium">Description</th>
                  <th className="py-3 pr-4 font-medium">Status</th>
                  <th className="py-3 pr-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {brands.map((brand) => (
                  <tr
                    key={brand._id}
                    className="border-b border-[#EBF3EC] hover:bg-[#EBF3EC]/50 transition"
                  >
                    <td className="py-3 pr-4">
                      {brand.logo ? (
                        <img
                          src={brand.logo}
                          alt={brand.name}
                          className="w-10 h-10 object-contain rounded-lg border border-[#8EB69B] bg-[#EBF3EC]"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg border border-[#8EB69B] bg-[#EBF3EC]" />
                      )}
                    </td>
                    <td className="py-3 pr-4 text-[#051F20] font-medium">
                      {brand.name}
                    </td>
                    <td className="py-3 pr-4 text-gray-500 max-w-xs truncate">
                      {brand.description || "—"}
                    </td>
                    <td className="py-3 pr-4">
                      <button
                        onClick={() => toggleStatus(brand)}
                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                          brand.status
                            ? "bg-[#EBF3EC] text-[#235347]"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {brand.status && <Check size={14} />}
                        {brand.status ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex justify-end gap-2">
                        <button className="p-2 rounded-lg hover:bg-[#EBF3EC] text-[#235347]">
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => deleteBrand(brand._id)}
                          className="p-2 rounded-lg hover:bg-red-50 text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Createbrand;