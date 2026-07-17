import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  ShoppingBag,
  IndianRupee,
  Users,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
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

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/seller/dashboard`, {
          withCredentials: true,
        });
        setStats(res.data.stats);
        setRecentOrders(res.data.recentOrders || []);
        setLowStockProducts(res.data.lowStockProducts || []);
      } catch (err) {
        console.log(err.response?.data || err);
        setError("Could not load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const cards = [
    {
      label: "Total Products",
      value: stats.totalProducts,
      icon: Package,
      color: "bg-blue-50 text-blue-600",
      link: "/seller/products",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: "bg-orange-50 text-orange-600",
      link: "/seller/orders",
    },
    {
      label: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString("en-IN")}`,
      icon: IndianRupee,
      color: "bg-green-50 text-green-600",
      link: null,
    },
    {
      label: "Total Customers",
      value: stats.totalCustomers,
      icon: Users,
      color: "bg-purple-50 text-purple-600",
      link: "/seller/customers",
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          An overview of your store's performance.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {cards.map((card) => {
          const Icon = card.icon;
          const content = (
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition h-full">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${card.color}`}>
                <Icon size={22} />
              </div>
              <p className="text-2xl font-bold text-gray-800 mt-4">{card.value}</p>
              <p className="text-sm text-gray-500 mt-1">{card.label}</p>
            </div>
          );

          return card.link ? (
            <Link key={card.label} to={card.link}>
              {content}
            </Link>
          ) : (
            <div key={card.label}>{content}</div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-gray-800">Recent Orders</h2>
            <Link
              to="/seller/orders"
              className="text-sm text-orange-500 hover:text-orange-600 flex items-center gap-1"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-gray-500 text-sm">No orders yet.</p>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between border-b last:border-b-0 pb-4 last:pb-0"
                >
                  <div>
                    <p className="font-medium text-gray-800 text-sm">
                      #{order._id.slice(-8).toUpperCase()} · {order.buyer}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {order.items} {order.items === 1 ? "item" : "items"} ·{" "}
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        statusStyles[order.status] || "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {order.status}
                    </span>
                    <span className="font-semibold text-gray-800 text-sm">
                      ₹{order.total.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <AlertTriangle className="text-yellow-500" size={18} />
            <h2 className="font-semibold text-gray-800">Low Stock Alerts</h2>
          </div>

          {lowStockProducts.length === 0 ? (
            <p className="text-gray-500 text-sm">
              All your products are well stocked.
            </p>
          ) : (
            <div className="space-y-4">
              {lowStockProducts.map((product) => (
                <Link
                  key={product._id}
                  to={`/seller/editproduct/${product._id}`}
                  className="flex items-center gap-3"
                >
                  <img
                    src={product.images?.[0]}
                    alt={product.title}
                    className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {product.title}
                    </p>
                    <p className="text-xs text-red-500">
                      {product.stock === 0
                        ? "Out of stock"
                        : `Only ${product.stock} left`}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;