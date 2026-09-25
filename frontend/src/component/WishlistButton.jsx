import { useState } from "react";
import axios from "axios";
import { API_URL } from "../config/api";
import {Heart} from "lucide-react"

const WishlistButton = ({ productId }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleWishlist = async () => {
    try {
      setLoading(true);

      if (isWishlisted) {
        await axios.delete(`${API_URL}/wishlist/${productId}`, {
          withCredentials: true,
        });

        setIsWishlisted(false);
      } else {
        await axios.post(
          `${API_URL}/wishlist/${productId}`,
          {},
          {
            withCredentials: true,
          }
        );

        setIsWishlisted(true);
      }
    } catch (error) {
      console.log("Wishlist error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleWishlist}
      disabled={loading}
      className="absolute top-2 right-2 z-10 w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center hover:scale-110 transition"
    >
      <span
        className={`text-xl leading-none ${
          isWishlisted ? "text-red-500" : "text-gray-500"
        }`}
      >
        {isWishlisted ? "♥" : "♡"}
      </span>
    </button>
  );
};

export default WishlistButton;