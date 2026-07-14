import { useEffect, useState } from "react";
import { Package, ChevronDown, ChevronUp, User, MapPin } from "lucide-react";
import axios from "axios";


const STATUS_OPTIONS = ["Pending", "Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"];

const statusStyles = {
  Pending: "bg-yellow-100 text-yellow-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Packed: "bg-indigo-100 text-indigo-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-600",
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:3000/api/seller/orders`, {
        withCredentials: true,
      });
      setOrders(res.data.orders || []);
    } catch (err) {
      console.log(err.response?.data || err);
      setError("Could not load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      await axios.patch(
        `http://localhost:3000/api/seller/orders/${orderId}/status`,
        { status: newStatus },
        { withCredentials: true }
      );
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
      );
    } catch (err) {
      console.log(err.response?.data || err);
      alert(err.response?.data?.message || "Could not update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
        <p className="text-gray-500 mt-1">
          Orders containing your products. Update the status as they progress.
        </p>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading orders...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-16 flex flex-col items-center justify-center text-center">
          <Package className="text-gray-300" size={56} />
          <h2 className="text-xl font-semibold text-gray-700 mt-6">
            No orders yet
          </h2>
          <p className="text-gray-500 mt-2">
            Orders for your products will show up here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isExpanded = expandedId === order._id;
            const isUpdating = updatingId === order._id;

            return (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <button
                  onClick={() => toggleExpand(order._id)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
                      <Package className="text-orange-500" size={22} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}{" "}
                        · {order.items.length} {order.items.length === 1 ? "item" : "items"} ·{" "}
                        {order.user?.username || "Unknown buyer"}
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
                    <span className="font-semibold text-gray-800">
                      ₹{order.sellerTotal.toLocaleString("en-IN")}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="text-gray-400" size={20} />
                    ) : (
                      <ChevronDown className="text-gray-400" size={20} />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t p-6 pt-5">
                    <div className="grid md:grid-cols-2 gap-4 mb-5">
                      <div className="bg-gray-50 rounded-lg p-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                          <User size={14} />
                          Buyer
                        </div>
                        <p className="text-gray-600">{order.user?.username}</p>
                        <p className="text-gray-500">{order.user?.email}</p>
                        <p className="text-gray-500">{order.user?.phone}</p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-700 font-medium mb-2">
                          <MapPin size={14} />
                          Delivery Address
                        </div>
                        <p className="text-gray-600">{order.address?.fullname}</p>
                        <p className="text-gray-500">
                          {order.address?.house}, {order.address?.area},{" "}
                          {order.address?.city}, {order.address?.state} -{" "}
                          {order.address?.pincode}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3 mb-5">
                      {order.items.map((item, index) => {
                        const product = item.product || {};
                        return (
                          <div key={index} className="flex gap-4 items-center">
                            <img
                              src={product.images?.[0]}
                              alt={product.title}
                              className="w-14 h-14 rounded-lg object-cover bg-gray-100"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-gray-800 text-sm">
                                {product.title || "Product unavailable"}
                              </p>
                              <p className="text-xs text-gray-500">
                                Qty: {item.quantity}
                                {item.selectedColor && ` · ${item.selectedColor}`}
                                {item.selectedSize && ` · ${item.selectedSize}`}
                              </p>
                            </div>
                            <p className="text-sm font-semibold text-gray-800">
                              ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex items-center gap-3 pt-4 border-t">
                      <label className="text-sm font-medium text-gray-700">
                        Update Status:
                      </label>
                      <select
                        value={order.orderStatus}
                        disabled={isUpdating}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="border rounded-lg px-3 py-2 text-sm disabled:opacity-50"
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                      {isUpdating && (
                        <span className="text-xs text-gray-400">Updating...</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;