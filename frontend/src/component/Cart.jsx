import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import axios from "axios";
import { API_URL } from "../config/api";


const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/cart`, { withCredentials: true });
      setCart(res.data.cart);
    } catch (err) {
      console.log(err.response?.data || err);
      setError("Could not load your cart. Please login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      setUpdatingId(itemId);
      const res = await axios.put(
        `${API_URL}/cart/${itemId}`,
        { quantity: newQuantity },
        { withCredentials: true }
      );
      setCart(res.data.cart);
    } catch (err) {
      console.log(err.response?.data || err);
    } finally {
      setUpdatingId(null);
    }
  };

  const removeItem = async (itemId) => {
    try {
      setUpdatingId(itemId);
      const res = await axios.delete(`http://localhost:3000/api/cart/${itemId}`, {
        withCredentials: true,
      });
      setCart(res.data.cart);
    } catch (err) {
      console.log(err.response?.data || err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EBF3EC] flex items-center justify-center">
        <p className="text-[#235347]">Loading your cart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#EBF3EC] flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const items = cart?.items || [];

  return (
    <div className="min-h-screen bg-[#EBF3EC] px-6 py-10 md:px-16">
      <h1 className="text-4xl font-bold text-[#051F20] mb-2">Your Cart</h1>
      <p className="text-[#235347] mb-10">
        {items.length} {items.length === 1 ? "item" : "items"} in your bag
      </p>

      {items.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-xl p-16 flex flex-col items-center justify-center text-center">
          <ShoppingBag className="text-[#8EB69B]" size={56} />
          <h2 className="text-2xl font-semibold text-[#051F20] mt-6">
            Your cart is empty
          </h2>
          <p className="text-gray-500 mt-2">
            Looks like you haven't added anything yet.
          </p>
          <Link to="/products">
            <button className="mt-6 bg-[#163832] hover:bg-[#0B2B26] text-white px-8 py-3 rounded-xl transition">
              Browse Products
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-5">
            {items.map((item) => {
              const product = item.product || {};
              const lineTotal = (item.price || 0) * item.quantity;
              const isUpdating = updatingId === item._id;

              return (
                <div
                  key={item._id}
                  className={`bg-white rounded-2xl shadow-sm p-5 flex gap-5 transition ${
                    isUpdating ? "opacity-60" : ""
                  }`}
                >
                  <img
                    src={product.images?.[0]}
                    alt={product.title}
                    className="w-24 h-24 rounded-xl object-cover bg-[#EBF3EC]"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-[#051F20]">
                          {product.title || "Product unavailable"}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {item.selectedColor && (
                            <span className="mr-3">Color: {item.selectedColor}</span>
                          )}
                          {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                        </p>
                      </div>

                      <button
                        onClick={() => removeItem(item._id)}
                        disabled={isUpdating}
                        className="text-gray-400 hover:text-red-500 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="flex justify-between items-end mt-4">
                      <div className="flex items-center gap-3 border border-[#8EB69B] rounded-xl px-3 py-1.5">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          disabled={isUpdating || item.quantity <= 1}
                          className="text-[#235347] hover:text-[#163832] disabled:opacity-30"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-6 text-center font-medium text-[#051F20]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          disabled={isUpdating}
                          className="text-[#235347] hover:text-[#163832]"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <p className="font-semibold text-[#051F20]">
                        ₹{lineTotal.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6 h-fit sticky top-8">
            <h2 className="text-xl font-semibold text-[#051F20] mb-6">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>₹{(cart?.totalPrice || 0).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            <div className="border-t border-[#EBF3EC] my-5" />

            <div className="flex justify-between mb-6">
              <span className="font-semibold text-[#051F20]">Total</span>
              <span className="font-bold text-[#051F20] text-lg">
                ₹{(cart?.totalPrice || 0).toLocaleString("en-IN")}
              </span>
            </div>

            <Link to="/checkout">
              <button className="w-full bg-[#163832] hover:bg-[#0B2B26] text-white py-3 rounded-xl transition">
                Proceed to Checkout
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;