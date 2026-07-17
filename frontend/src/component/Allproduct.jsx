import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import axios from "axios";
import { API_URL } from "../config/api";

const Allproduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/getallproducts`);
        setProducts(res.data.products || []);
      } catch (err) {
        console.log(err.response?.data || err);
        setError("Could not load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  const categories = useMemo(() => {
    const unique = new Set(products.map((p) => p.category).filter(Boolean));
    return ["All", ...unique];
  }, [products]);

  const visibleProducts = useMemo(() => {
    let list = products.filter((p) => {
      const matchesSearch = p.title?.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    if (sortBy === "price-low") {
      list = [...list].sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      list = [...list].sort((a, b) => b.price - a.price);
    } else {
      list = [...list].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    }

    return list;
  }, [products, search, categoryFilter, sortBy]);

  return (
    <div className="min-h-screen bg-[#EBF3EC] px-6 py-10 md:px-16">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-[#051F20]">All Products</h1>
        <p className="text-[#235347] mt-2">
          Explore the full UNFOLD collection.
        </p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm p-5 mb-8 flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full border border-[#8EB69B] rounded-xl pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-[#235347]"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border border-[#8EB69B] rounded-xl px-4 py-2.5"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-2 border border-[#8EB69B] rounded-xl px-4 py-2.5">
          <SlidersHorizontal size={16} className="text-[#235347]" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="outline-none bg-transparent"
          >
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>
      {loading ? (
        <p className="text-[#235347]">Loading products...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : visibleProducts.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {visibleProducts.map((product) => (
            <Link key={product._id} to={`/productview/${product._id}`}>
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition group">
                <div className="aspect-square overflow-hidden bg-[#EBF3EC]">
                  <img
                    src={product.images?.[0]}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>

                <div className="p-4">
                  <p className="text-xs text-[#235347] font-medium uppercase tracking-wide">
                    {product.category}
                  </p>
                  <h3 className="font-semibold text-[#051F20] mt-1 truncate">
                    {product.title}
                  </h3>
                  <div className="flex items-center justify-between mt-2">
                    <p className="font-bold text-[#163832]">
                      ₹{Number(product.price).toLocaleString("en-IN")}
                    </p>
                    {product.stock === 0 && (
                      <span className="text-xs font-medium text-red-500">
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Allproduct;