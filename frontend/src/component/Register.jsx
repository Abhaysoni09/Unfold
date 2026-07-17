import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext";
import { API_URL } from "../config/api";

const ROLE_REDIRECTS = {
  user: "/",
  seller: "/seller",
  admin: "/admin/dashboard",
};

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    role: "user",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const res = await axios.post(
        `${API_URL}/auth/register`,
        formData,
        { withCredentials: true }
      );

      const user = res.data.user;
      setUser(user);

      setFormData({
        username: "",
        email: "",
        phone: "",
        password: "",
        role: "user",
      });

      const redirectTo = ROLE_REDIRECTS[user.role] || "/";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EBF3EC] flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#163832]">UNFOLD</h1>
          <p className="text-[#235347] mt-2">Create your account</p>
        </div>

        {error && (
          <div className="mt-6 bg-red-50 border border-red-300 text-red-700 rounded-xl p-3 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="block mb-2 text-sm font-medium text-[#051F20]">
              I am a
            </label>
            <div className="grid grid-cols-2 gap-3">
              {["user", "seller"].map((role) => (
                <label
                  key={role}
                  className={`flex items-center justify-center gap-2 border-2 rounded-xl py-3 cursor-pointer transition ${
                    formData.role === role
                      ? "border-[#163832] bg-[#EBF3EC] text-[#163832] font-medium"
                      : "border-[#8EB69B] text-gray-600"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={role}
                    checked={formData.role === role}
                    onChange={handleChange}
                    className="accent-[#163832]"
                  />
                  {role === "user" ? "Buyer" : "Seller"}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-[#051F20]">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
              className="w-full border border-[#8EB69B] rounded-xl px-4 py-3 outline-none focus:border-[#163832] focus:ring-2 focus:ring-[#163832]/20"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-[#051F20]">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              className="w-full border border-[#8EB69B] rounded-xl px-4 py-3 outline-none focus:border-[#163832] focus:ring-2 focus:ring-[#163832]/20"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-[#051F20]">
              Mobile No
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter mobile number"
              className="w-full border border-[#8EB69B] rounded-xl px-4 py-3 outline-none focus:border-[#163832] focus:ring-2 focus:ring-[#163832]/20"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-[#051F20]">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full border border-[#8EB69B] rounded-xl px-4 py-3 outline-none focus:border-[#163832] focus:ring-2 focus:ring-[#163832]/20"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#163832] hover:bg-[#235347] disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition duration-300"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-6 text-[#235347]">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-[#163832] hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;