import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getWishlist,
  removeFromWishlist,
} from "../services/wishlistService";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const data = await getWishlist();
      setWishlist(data.wishlist || []);
    } catch (error) {
      console.log("Wishlist error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);

      setWishlist((prev) =>
        prev.filter((product) => product._id !== productId)
      );
    } catch (error) {
      console.log("Remove wishlist error:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-gray-500">Loading wishlist...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">

      {/* Heading */}
      <div className="px-6 md:px-10 pt-10 pb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          My Wishlist <span>💗</span>
        </h1>
      </div>

      {/* Empty Wishlist */}
      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-6xl mb-4">
            ♡
          </div>

          <h2 className="text-xl font-semibold text-gray-800">
            Your wishlist is empty
          </h2>

          <p className="text-gray-500 mt-2">
            Add products you love to your wishlist.
          </p>
        </div>
      ) : (

        <div className="grid px-6 md:px-10 pb-12 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">

          {wishlist.map((product) => (

            <div
              key={product._id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition overflow-hidden"
            >

              {/* Clickable Product Image */}
              <Link to={`/productview/${product._id}`}>
                <div className="h-56 overflow-hidden bg-gray-100 cursor-pointer">

                  <img
                    src={product.images?.[0]}
                    alt={product.title}
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                  />

                </div>
              </Link>


              {/* Product Details */}
              <div className="p-4">

                {/* Category */}
                <p className="text-xs text-gray-500">
                  {product.category}
                </p>


                {/* Clickable Title */}
                <Link to={`/productview/${product._id}`}>
                  <h2 className="text-sm font-semibold text-gray-800 mt-1 truncate hover:text-green-700 cursor-pointer">
                    {product.title}
                  </h2>
                </Link>


                {/* Price */}
                <p className="text-lg font-bold text-green-700 mt-2">
                  ₹{product.price}
                </p>


                {/* Remove */}
                <button
                  type="button"
                  onClick={() => handleRemove(product._id)}
                  className="w-full mt-4 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-lg transition"
                >
                  Remove
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
};

export default Wishlist;