import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config/api";


const Updateproducts = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [brands, setBrands] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    brand: "",
    price: "",
    stock: "",
    colors: "",
    sizes: "",
    material: "",
    warranty: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [productRes, brandRes] = await Promise.all([
          axios.get(`${API_URL}/products/${id}`,{
            withCredentials:true
          }),
          axios.get(`${API_URL}/brands`,{
            withCredentials:true
          })
        ]);

        const product = productRes.data.products;

        setForm({
          title: product.title || "",
          description: product.description || "",
          category: product.category?._id || product.category || "",
          brand: product.brand?._id || product.brand || "",
          price: product.price ?? "",
          stock: product.stock ?? "",
          colors: (product.colors || []).join(", "),
          sizes: (product.sizes || []).join(", "),
          material: product.material || "",
          warranty: product.warranty || "",
        });

        setBrands(brandRes.data.brands || []);
      } catch (err) {
        console.log(err.response?.data || err);
        setError("Could not load product.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setError("");

    if (!form.title || !form.description || !form.category || !form.brand || form.price === "") {
      setError("Please fill in all required fields.");
      return;
    }

    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock || 0),
      colors: form.colors.split(",").map((c) => c.trim()).filter(Boolean),
      sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
    };

    try {
      setSaving(true);
      await axios.put(`${API_URL}/products/${id}`, payload,{
            withCredentials:true
          });
      alert("Product Edit successful")
      navigate("/seller/products");
    } catch (err) {
      console.log(err.response?.data || err);
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EBF3EC] p-8">
        <p className="text-[#235347]">Loading product...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EBF3EC] p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#051F20]">Edit Product</h1>
        <p className="text-[#235347] mt-2">Update details for this bag.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-300 text-red-700 rounded-xl p-3 text-sm">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="font-medium text-[#051F20]">Product Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-[#8EB69B] p-3 outline-none focus:ring-2 focus:ring-[#235347]"
              />
            </div>

            <div>
              <label className="font-medium text-[#051F20]">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="5"
                className="mt-2 w-full rounded-xl border border-[#8EB69B] p-3 outline-none focus:ring-2 focus:ring-[#235347]"
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="font-medium text-[#051F20]">Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-[#8EB69B] p-3"
                >
                  <option value="">Select category</option>
                  <option value="Backpack">Backpack</option>
                  <option value="Laptop Bag">Laptop Bag</option>
                  <option value="Travel Bag">Travel Bag</option>
                  <option value="Duffel Bag">Duffel Bag</option>
                  <option value="School Bag">School Bag</option>
                  <option value="College Bag">College Bag</option>
                  <option value="Office Bag">Office Bag</option>
                  <option value="Messenger Bag">Messenger Bag</option>
                  <option value="Sling Bag">Sling Bag</option>
                  <option value="Crossbody Bag">Crossbody Bag</option>
                  <option value="Tote Bag">Tote Bag</option>
                  <option value="Handbag">Handbag</option>
                  <option value="Gym Bag">Gym Bag</option>
                  <option value="Hiking Backpack">Hiking Backpack</option>
                  <option value="Camping Bag">Camping Bag</option>
                  <option value="Luggage">Luggage</option>
                  <option value="Suitcase">Suitcase</option>
                  <option value="Waist Bag">Waist Bag</option>
                  <option value="Wallet">Wallet</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>

              <div>
                <label className="font-medium text-[#051F20]">Brand</label>
                <select
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-[#8EB69B] p-3"
                >
                  <option value="">Select brand</option>
                  {brands.map((b) => (
                    <option key={b._id} value={b._id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="font-medium text-[#051F20]">Price</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-[#8EB69B] p-3"
                />
              </div>

              <div>
                <label className="font-medium text-[#051F20]">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-[#8EB69B] p-3"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="font-medium text-[#051F20]">
                  Colors (comma separated)
                </label>
                <input
                  name="colors"
                  value={form.colors}
                  onChange={handleChange}
                  placeholder="Black, Brown, Tan"
                  className="mt-2 w-full rounded-xl border border-[#8EB69B] p-3"
                />
              </div>

              <div>
                <label className="font-medium text-[#051F20]">
                  Sizes (comma separated)
                </label>
                <input
                  name="sizes"
                  value={form.sizes}
                  onChange={handleChange}
                  placeholder="S, M, L"
                  className="mt-2 w-full rounded-xl border border-[#8EB69B] p-3"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="font-medium text-[#051F20]">Material</label>
                <input
                  name="material"
                  value={form.material}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-[#8EB69B] p-3"
                />
              </div>

              <div>
                <label className="font-medium text-[#051F20]">Warranty</label>
                <input
                  name="warranty"
                  value={form.warranty}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-xl border border-[#8EB69B] p-3"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="font-medium text-[#051F20]">
              Product Images
            </label>
            <p className="mt-2 text-sm text-gray-500 bg-[#EBF3EC] border border-[#8EB69B] rounded-xl p-4">
              Image editing isn't wired up on the backend yet — this form
              currently updates text and pricing fields only. Ask me to add
              image add/remove support once the update route accepts file
              uploads.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-10">
          <button
            onClick={() => navigate("/seller/products")}
            className="border border-[#8EB69B] text-[#051F20] px-8 py-3 rounded-xl transition hover:bg-[#EBF3EC]"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#163832] hover:bg-[#0B2B26] disabled:opacity-50 text-white px-8 py-3 rounded-xl transition"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Updateproducts;