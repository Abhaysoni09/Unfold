import { Link } from "react-router-dom";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";


function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  async function fetchProducts() {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:3000/api/products`, {
        withCredentials: true,
      });
      setProducts(res.data.products || []);
    } catch (err) {
      console.log(err.response?.data || err);
      setError("Could not load products.");
    } finally {
      setLoading(false);
    }
  }

  

  useEffect(() => {
    fetchProducts();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("Delete this product? This cannot be undone.")) return;
    try {
      await axios.delete(`http://localhost:3000/api/products/${id}`, {
        withCredentials: true,
      });
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.log(err.response?.data || err);
      alert(err.response?.data?.message || "Could not delete product.");
    }
  }

  const getStatus = (product) => (product.stock > 0 ? "Active" : "Out of Stock");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.title
        ?.toLowerCase()
        .includes(search.toLowerCase());


      const status = getStatus(product);
      const matchesStatus = statusFilter === "All" || status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [products, search, statusFilter]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Products</h1>
          <p className="text-gray-500 mt-1">Manage all products of your store.</p>
        </div>

        <Link to="/seller/createproduct">
          <button className="flex items-center gap-2 bg-[#163832] hover:bg-[#0B2B26] disabled:opacity-50 text-white px-5 py-3 rounded-xl transition">
            <Plus size={18} />
            Add Product
          </button>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Product..."
              className="w-full border rounded-lg pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-4 py-2"
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <p className="p-6 text-gray-500">Loading products...</p>
        ) : error ? (
          <p className="p-6 text-red-500">{error}</p>
        ) : filteredProducts.length === 0 ? (
          <p className="p-6 text-gray-500">No products found.</p>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-6 py-4">Product</th>
                <th className="text-left px-6 py-4">Category</th>
                <th className="text-left px-6 py-4">Price</th>
                <th className="text-left px-6 py-4">Stock</th>
                <th className="text-left px-6 py-4">Status</th>
                <th className="text-center px-6 py-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product) => {
                const status = getStatus(product);
                return (
                  <tr key={product._id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4 flex items-center gap-4">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-14 h-14 rounded-lg object-cover bg-gray-100"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-gray-200" />
                      )}

                      <div>
                        <h3 className="font-semibold">{product.title}</h3>
                        <p className="text-sm text-gray-500">
                          ID #{product._id.slice(-6)}
                        </p>
                      </div>
                    </td>

                    <td className="px-6 py-4">{(product.category)}</td>

                    <td className="px-6 py-4">
                      ₹{Number(product.price).toLocaleString("en-IN")}
                    </td>

                    <td className="px-6 py-4">{product.stock}</td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-4">
                        <Link to={`/seller/updateproduct/${product._id}`}>
                          <button className="text-blue-500 hover:text-blue-700">
                            <Pencil size={18} />
                          </button>
                        </Link>

                        <button
                          onClick={() => handleDelete(product._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Products;