import axios from "axios";

import { API_URL } from "../config/api";

// Get wishlist
export const getWishlist = async () => {
  const response = await axios.get(`${API_URL}/wishlist`, {
    withCredentials: true,
  });

  return response.data;
};


// Add to wishlist
export const addToWishlist = async (productId) => {
  const response = await axios.post(
    `${API_URL}/wishlist/${productId}`,
    {},
    {
      withCredentials: true,
    }
  );

  return response.data;
};


// Remove from wishlist
export const removeFromWishlist = async (productId) => {
  const response = await axios.delete(
    `${API_URL}/wishlist/${productId}`,
    {
      withCredentials: true,
    }
  );

  return response.data;
};