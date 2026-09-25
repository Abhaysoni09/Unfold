import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import WishlistButton from "./WishlistButton";
import Addtocartbutton from "./Addtocartbutton";
import { API_URL } from "../config/api";

const ProductCard = () => {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/getproducts`, {
        withCredentials: true,
      });

      setProducts(res.data.products);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="grid p-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">

      {products.map((product) => (
        <div
          key={product._id}
          className="bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden"
        >

          {/* Image + Wishlist */}
          <div className="h-40 overflow-hidden relative">

            <img
              src={product.images?.[0]}
              alt={product.title}
              className="w-full h-full object-cover hover:scale-105 transition"
            />

            <WishlistButton productId={product._id} />

          </div>

          {/* Product Details */}
          <div className="p-3">

            {/* Category */}
            <p className="text-xs text-gray-500">
              {product.category}
            </p>

            {/* Title */}
            <h2 className="text-sm font-semibold text-gray-800 mt-1 truncate">
              {product.title}
            </h2>

            {/* Price + Stock */}
            <div className="flex justify-between items-center mt-2">

              <span className="text-lg font-bold text-green-700">
                ₹{product.price}
              </span>

              <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-full">
                {product.stock > 0 ? "Stock" : "Out"}
              </span>

            </div>

            {/* Colors */}
            <div className="flex gap-1 mt-2">

              {product.colors?.slice(0, 3).map((color, index) => (
                <span
                  key={index}
                  className="text-[10px] bg-gray-100 px-2 py-1 rounded"
                >
                  {color}
                </span>
              ))}

            </div>

            {/* Buttons */}
            <div className="flex gap-3 mt-5">

              <Link
                className="flex-1 bg-[#163832] hover:bg-[#0f2924] text-white text-center py-2 rounded-lg transition"
                to={`/productview/${product._id}`}
              >
                View
              </Link>

              <Addtocartbutton
                productId={product._id}
              />

            </div>

          </div>

        </div>
      ))}

    </div>
  );
};

export default ProductCard;