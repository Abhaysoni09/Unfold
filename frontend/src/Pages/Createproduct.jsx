import { Upload, X } from "lucide-react";
import { useRef, useState ,useEffect} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom"
import { API_URL } from "../config/api";

const Createproduct = () => {
  const fileInputRef = useRef(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [brand ,setbrand] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate()

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addproduct = async () => {
    setError("");

    if (!form.title || !form.description || !form.category || !form.brand || !form.price) {
      setError("Please fill in all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("category", form.category);
    formData.append("brand", form.brand);
    formData.append("price", form.price);
    formData.append("stock", form.stock || 0);
    formData.append("material", form.material);
    formData.append("warranty", form.warranty);

    form.colors
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean)
      .forEach((c) => formData.append("colors[]", c));

    form.sizes
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((s) => formData.append("sizes[]", s));

    images.forEach((img) => formData.append("images", img));

    try {
      setLoading(true);
       await axios.post(
        `${API_URL}/createproducts`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" }, 
      
        withCredentials:true
      }
      );
      alert("Product Created Successfully")
      navigate("/seller/products")
      setForm({
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
      setImages([]);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  const fetchOptions = async () => {
    try {
      const brands = await Promise.all([
        axios.get(`${API_URL}/brands`,{
          withCredentials:true
        }),
      ]);
      setbrand(brands[0].data.brands || []);
    } catch (err) {
      console.log(err);
    }
  };
  fetchOptions();
}, []);

  return (
    <div className="min-h-screen bg-[#EBF3EC] p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#051F20]">Create Product</h1>
        <p className="text-[#235347] mt-2">Add a new bag to your UNFOLD store.</p>
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
                placeholder="Leather Backpack"
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
                    {brand.map((b) => (
                      <option key={b._id} value={b._id}>{b.name}</option>
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
                <label className="font-medium text-[#051F20]">Colors (comma separated)</label>
                <input
                  name="colors"
                  value={form.colors}
                  onChange={handleChange}
                  placeholder="Black, Brown, Tan"
                  className="mt-2 w-full rounded-xl border border-[#8EB69B] p-3"
                />
              </div>

              <div>
                <label className="font-medium text-[#051F20]">Sizes (comma separated)</label>
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
            <label className="font-medium text-[#051F20]">Product Images</label>

            <input
              type="file"
              multiple
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
            />
            <div
              onClick={() => fileInputRef.current.click()}
              className="mt-2 h-48 rounded-2xl border-2 border-dashed border-[#8EB69B] flex flex-col items-center justify-center bg-[#EBF3EC] cursor-pointer hover:bg-[#dce8df] transition"
            >
              <Upload className="text-[#235347]" size={40} />
              <p className="mt-3 text-[#235347] font-semibold">Click to Upload Product Images</p>
              <p className="text-sm text-gray-500">PNG, JPG, JPEG</p>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-5">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt="preview"
                      className="w-full h-28 object-cover rounded-xl border border-[#8EB69B]"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-10">
          <button
            onClick={addproduct}
            disabled={loading}
            className="bg-[#163832] hover:bg-[#0B2B26] disabled:opacity-50 text-white px-8 py-3 rounded-xl transition"
          >
            {loading ? "Creating..." : "Create Product"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Createproduct;