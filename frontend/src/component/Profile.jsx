import { useEffect, useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  LogOut,
  Pencil,
  ShieldCheck,
  ShieldAlert,
  Calendar,
} from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/Authcontext";
import { API_URL } from "../config/api";

const Profile = () => {
  const { user, setUser} = useAuth();
  const Navigate = useNavigate()

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  



  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
  });
  useEffect(() => {
    

    if (user) {
      setForm({
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setError("");
    setSuccess("");

    if (!form.username.trim() || !form.email.trim()) {
      setError("Username and email are required.");
      return;
    }

    try {
      setSaving(true);
      const res = await axios.put(`${API_URL}/auth/profile`, form, {
        withCredentials: true,
      });
      setUser(res.data.user);
      setSuccess("Profile updated successfully.");
      setEditing(false);
    } catch (err) {
      console.log(err.response?.data || err);
      setError(err.response?.data?.message || "Could not update profile.");
    } finally {
      setSaving(false);
    }
  };


  const handleCancel = () => {
    setForm({
      username: user.username || "",
      email: user.email || "",
      phone: user.phone || "",
    });
    setEditing(false);
    setError("");
  };

  const logout =async ()=>{
        try{
            await axios.post(`${API_URL}/auth/logout`,{},
            {
                withCredentials: true,
            }
        );
            alert("Logout successfully")
            setUser(null);
            Navigate("/")
        }catch(err){
            console.log(err);
            console.log("error")
        }
    }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#EBF3EC] flex items-center justify-center">
        <p className="text-[#235347]">Loading your profile...</p>
      </div>
    );
  }

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <div className="min-h-screen bg-[#EBF3EC] px-6 py-10 md:px-16">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#051F20]">My Profile</h1>
          <p className="text-[#235347] mt-2">
            Manage your account details and preferences.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white rounded-3xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#163832] flex items-center justify-center text-white text-2xl font-semibold">
                  {(form.username || "U").charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-[#051F20]">
                    {form.username || "Username"}
                  </h2>
                  <p className="text-sm text-gray-500">{form.email}</p>
                </div>
              </div>

              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 text-sm font-medium text-[#235347] hover:text-[#163832]"
                >
                  <Pencil size={16} />
                  Edit
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-[#EBF3EC] text-[#235347] capitalize">
                {user.role}
              </span>

              {user.isverified ? (
                <span className="flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full bg-green-50 text-green-700">
                  <ShieldCheck size={12} />
                  Verified
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full bg-yellow-50 text-yellow-700">
                  <ShieldAlert size={12} />
                  Not Verified
                </span>
              )}

              <span className="flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-600">
                <Calendar size={12} />
                Member since {memberSince}
              </span>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-300 text-red-700 rounded-xl p-3 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-6 bg-green-50 border border-green-300 text-green-700 rounded-xl p-3 text-sm">
                {success}
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium text-[#051F20] flex items-center gap-2">
                  <User size={16} className="text-[#235347]" />
                  Username
                </label>
                {editing ? (
                  <input
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-[#8EB69B] p-3 outline-none focus:ring-2 focus:ring-[#235347]"
                  />
                ) : (
                  <p className="mt-2 text-gray-700">{form.username || "—"}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-[#051F20] flex items-center gap-2">
                  <Mail size={16} className="text-[#235347]" />
                  Email
                </label>
                {editing ? (
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl border border-[#8EB69B] p-3 outline-none focus:ring-2 focus:ring-[#235347]"
                  />
                ) : (
                  <p className="mt-2 text-gray-700">{form.email || "—"}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-[#051F20] flex items-center gap-2">
                  <Phone size={16} className="text-[#235347]" />
                  Phone
                </label>
                {editing ? (
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Add a phone number"
                    className="mt-2 w-full rounded-xl border border-[#8EB69B] p-3 outline-none focus:ring-2 focus:ring-[#235347]"
                  />
                ) : (
                  <p className="mt-2 text-gray-700">{form.phone || "—"}</p>
                )}
              </div>
            </div>

            {editing && (
              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={handleCancel}
                  className="border border-[#8EB69B] text-[#051F20] px-6 py-3 rounded-xl hover:bg-[#EBF3EC] transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-[#163832] hover:bg-[#0B2B26] disabled:opacity-50 text-white px-6 py-3 rounded-xl transition"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Link to="/orders">
              <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4 hover:bg-[#EBF3EC] transition cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-[#EBF3EC] flex items-center justify-center">
                  <Package className="text-[#235347]" size={20} />
                </div>
                <div>
                  <p className="font-medium text-[#051F20]">My Orders</p>
                  <p className="text-sm text-gray-500">Track and view past orders</p>
                </div>
              </div>
            </Link>

            <Link to="/address">
              <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4 hover:bg-[#EBF3EC] transition cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-[#EBF3EC] flex items-center justify-center">
                  <MapPin className="text-[#235347]" size={20} />
                </div>
                <div>
                  <p className="font-medium text-[#051F20]">Saved Addresses</p>
                  <p className="text-sm text-gray-500">Manage delivery addresses</p>
                </div>
              </div>
            </Link>

            <button
              onClick={logout}
              className="w-full bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4 hover:bg-red-50 transition text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                <LogOut className="text-red-500" size={20} />
              </div>
              <div>
                <p className="font-medium text-red-500">Logout</p>
                <p className="text-sm text-gray-400">Sign out of your account</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;