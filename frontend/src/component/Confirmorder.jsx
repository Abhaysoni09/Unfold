import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CheckCircle2, Package, MapPin, Truck } from "lucide-react";
import axios from "axios";

const Confirmorder = () => {
  const { id } = useParams();
  console.log(id)
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:3000/api/order/${id}`, {
          withCredentials: true,
        });
        console.log(res.data.order)
        setOrder(res.data.order);
      } catch (err) {
        console.log(err.response?.data || err);
        setError("Could not load your order.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EBF3EC] flex items-center justify-center">
        <p className="text-[#235347]">Loading your order...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-[#EBF3EC] flex flex-col items-center justify-center text-center px-6">
        <p className="text-red-600">{error || "Order not found."}</p>
        <Link to="/products">
          <button className="mt-6 bg-[#163832] hover:bg-[#0B2B26] text-white px-8 py-3 rounded-xl transition">
            Continue Shopping
          </button>
        </Link>
      </div>
    );
  }

 const address = order.address || {};

  return (
    <div className="min-h-screen bg-[#EBF3EC] px-6 py-10 md:px-16">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-10 text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="text-[#235347]" size={64} />
          </div>
          <h1 className="text-3xl font-bold text-[#051F20]">
            Order Placed Successfully!
          </h1>
          <p className="text-[#235347] mt-3">
            Thank you for shopping with UNFOLD. A confirmation has been saved to
            your account.
          </p>

          <div className="inline-flex items-center gap-2 mt-6 bg-[#EBF3EC] text-[#051F20] px-5 py-2 rounded-full text-sm font-medium">
            <Package size={16} />
            Order #{order._id.slice(-8).toUpperCase()}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="text-[#235347]" size={20} />
              <h2 className="font-semibold text-[#051F20]">Delivery Address</h2>
            </div>
            <p className="font-medium text-[#051F20]">{address.fullname}</p>
            <p className="text-sm text-gray-500 mt-1">{address.phone}</p>
            <p className="text-sm text-gray-600 mt-3 leading-relaxed">
              {address.house}, {address.area}
              {address.landmark && `, ${address.landmark}`}
              <br />
              {address.city}, {address.state} - {address.pincode}
              <br />
              {address.country}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Truck className="text-[#235347]" size={20} />
              <h2 className="font-semibold text-[#051F20]">Order Info</h2>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Order Date</span>
                <span className="text-[#051F20] font-medium">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Method</span>
                <span className="text-[#051F20] font-medium">
                  {order.paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Status</span>
                <span
                  className={`font-medium ${
                    order.paymentStatus === "Paid"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  {order.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Order Status</span>
                <span className="text-[#051F20] font-medium">{order.orderStatus}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h2 className="font-semibold text-[#051F20] mb-5">
            Items ({order.products.length})
          </h2>

          <div className="space-y-4">
            {order.products.map((item, index) => (
              <div key={index} className="flex gap-4 items-center">
                <img
                  src={item.product.images}
                  alt={item.product.title}
                  className="w-16 h-16 rounded-lg object-cover bg-[#EBF3EC]"
                />
                <div className="flex-1">
                  <p className="font-medium text-[#051F20]">{item.product.title}</p>
                  <p className="text-sm text-gray-500">
                    Qty: {item.quantity}
                    {item.selectedColor && ` · ${item.selectedColor}`}
                    {item.selectedSize && ` · ${item.selectedSize}`}
                  </p>
                </div>
                <p className="font-semibold text-[#051F20]">
                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-[#EBF3EC] my-5" />

          <div className="flex justify-between">
            <span className="font-semibold text-[#051F20]">Total Paid</span>
            <span className="font-bold text-[#051F20] text-lg">
              ₹{order.totalAmount.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <Link to="/orders">
            <button className="border border-[#8EB69B] text-[#051F20] px-6 py-3 rounded-xl hover:bg-white transition">
              View All Orders
            </button>
          </Link>
          <Link to="/products">
            <button className="bg-[#163832] hover:bg-[#0B2B26] text-white px-6 py-3 rounded-xl transition">
              Continue Shopping
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Confirmorder;