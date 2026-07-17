import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "../config/api";

const ROLE_REDIRECTS = {
  user: "/",
  seller: "/seller",
  admin: "/admin/dashboard",
};

const Login = () => {
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${API_URL}/auth/login`,
        {
          identity,
          password,
        },
        {
          withCredentials: true,
        }
      );

      const user = res.data.user;

      setUser(user);

      setIdentity("");
      setPassword("");

      const redirectTo = ROLE_REDIRECTS[user.role] || "/";

      navigate(redirectTo);
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-[#EBF3EC] flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">

        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#163832]">
            UNFOLD
          </h1>

          <p className="text-[#235347] mt-2">
            Welcome back! Login to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">

          <div>
            <label className="block mb-2 text-sm font-medium text-[#051F20]">
              Email or Mobile Number
            </label>

            <input
              type="text"
              value={identity}
              onChange={(e) => setIdentity(e.target.value)}
              placeholder="Enter email or mobile number"
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full border border-[#8EB69B] rounded-xl px-4 py-3 outline-none focus:border-[#163832] focus:ring-2 focus:ring-[#163832]/20"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#163832] hover:bg-[#235347] text-white py-3 rounded-xl font-semibold transition duration-300"
          >
            Login
          </button>

        </form>

        <div className="mt-6 text-center">

          <Link
            to="/forgot-password"
            className="text-sm text-[#235347] hover:text-[#163832]"
          >
            Forgot Password?
          </Link>

          <p className="mt-4 text-[#235347]">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-[#163832] hover:underline"
            >
              Register
            </Link>
          </p>

        </div>

      </div>
    </div>
  );
};

export default Login;