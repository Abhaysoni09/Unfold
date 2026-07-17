import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, ChevronDown, ChevronUp } from "lucide-react";
import axios from "axios";
import { API_URL } from "../config/api";

const statusStyles = {
  Pending: "bg-yellow-100 text-yellow-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Packed: "bg-indigo-100 text-indigo-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-600",
};

const Allorder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/myorder`, {
          withCredentials: true,
        });
        setOrders(res.data.orders || []);
      } catch (err) {
        console.log(err.response?.data || err);
        setError("Could not load your orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-[#EBF3EC] px-6 py-10 md:px-16">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#051F20]">My Orders</h1>
          <p className="text-[#235347] mt-2">Track and review your past purchases.</p>
        </div>

        {loading ? (
          <p className="text-[#235347]">Loading your orders...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-16 flex flex-col items-center justify-center text-center">
            <Package className="text-[#8EB69B]" size={56} />
            <h2 className="text-2xl font-semibold text-[#051F20] mt-6">
              No orders yet
            </h2>
            <p className="text-gray-500 mt-2">
              Once you place an order, it'll show up here.
            </p>
            <Link to="/products">
              <button className="mt-6 bg-[#163832] hover:bg-[#0B2B26] text-white px-8 py-3 rounded-xl transition">
                Browse Products
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const isExpanded = expandedId === order._id;
              const products = order.products || [];
              const address = order.address || {};

              return (
                <div key={order._id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <button
                    onClick={() => toggleExpand(order._id)}
                    className="w-full flex items-center justify-between p-6 text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-[#EBF3EC] flex items-center justify-center">
                        <Package className="text-[#235347]" size={22} />
                      </div>
                      <div>
                        <p className="font-semibold text-[#051F20]">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}{" "}
                          · {products.length} {products.length === 1 ? "item" : "items"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          statusStyles[order.orderStatus] || "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                      <span className="font-semibold text-[#051F20]">
                        ₹{(order.totalAmount || 0).toLocaleString("en-IN")}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="text-gray-400" size={20} />
                      ) : (
                        <ChevronDown className="text-gray-400" size={20} />
                      )}
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="border-t border-[#EBF3EC] p-6 pt-5">
                      <div className="space-y-4 mb-5">
                        {products.map((item, index) => {
                          const product = item.product || {};
                          return (
                            <div key={index} className="flex gap-4 items-center">
                              <img
                                src={product.images?.[0]}
                                alt={product.title}
                                className="w-14 h-14 rounded-lg object-cover bg-[#EBF3EC]"
                              />
                              <div className="flex-1">
                                <p className="font-medium text-[#051F20] text-sm">
                                  {product.title || "Product unavailable"}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Qty: {item.quantity}
                                  {item.selectedColor && ` · ${item.selectedColor}`}
                                  {item.selectedSize && ` · ${item.selectedSize}`}
                                </p>
                              </div>
                              <p className="text-sm font-semibold text-[#051F20]">
                                ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                      <div className="bg-[#EBF3EC] rounded-xl p-4 text-sm text-gray-600">
                        <p className="font-medium text-[#051F20] mb-1">
                          Delivered to: {address.fullname}
                        </p>
                        <p>
                          {address.house}, {address.area}, {address.city}, {address.state}{" "}
                          - {address.pincode}
                        </p>
                        <p className="mt-2">
                          Payment: {order.paymentMethod === "COD" ? "Cash on Delivery" : "Online"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Allorder;