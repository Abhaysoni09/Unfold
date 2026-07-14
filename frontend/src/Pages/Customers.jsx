import { useEffect, useMemo, useState } from "react";
import { Search, Mail, Phone, ShoppingBag, Calendar } from "lucide-react";
import axios from "axios";


function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:3000/api/customers`, {
          withCredentials: true,
        });
        setCustomers(res.data.customers || []);
      } catch (err) {
        console.log(err.response?.data || err);
        setError("Could not load customers.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    return customers.filter(
      (c) =>
        c.username?.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase())
    );
  }, [customers, search]);

  const initials = (name) => (name ? name.charAt(0).toUpperCase() : "U");

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Customers</h1>
        <p className="text-gray-500 mt-1">
          People who have bought your products.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full border rounded-lg pl-10 pr-4 py-2 outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <p className="p-6 text-gray-500">Loading customers...</p>
        ) : error ? (
          <p className="p-6 text-red-500">{error}</p>
        ) : filteredCustomers.length === 0 ? (
          <p className="p-6 text-gray-500">No customers yet.</p>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-6 py-4">Customer</th>
                <th className="text-left px-6 py-4">Contact</th>
                <th className="text-left px-6 py-4">Orders</th>
                <th className="text-left px-6 py-4">Total Spent</th>
                <th className="text-left px-6 py-4">Last Order</th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer._id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold">
                        {initials(customer.username)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {customer.username}
                        </h3>
                        <p className="text-xs text-gray-500">
                          ID #{customer._id.slice(-6)}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <p className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail size={14} className="text-gray-400" />
                      {customer.email}
                    </p>
                    {customer.phone && (
                      <p className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <Phone size={14} className="text-gray-400" />
                        {customer.phone}
                      </p>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <span className="flex items-center gap-2 text-gray-700">
                      <ShoppingBag size={14} className="text-gray-400" />
                      {customer.totalOrders}
                    </span>
                  </td>

                  <td className="px-6 py-4 font-semibold text-gray-800">
                    ₹{customer.totalSpent.toLocaleString("en-IN")}
                  </td>

                  <td className="px-6 py-4">
                    <span className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar size={14} className="text-gray-400" />
                      {new Date(customer.lastOrderDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Customers;