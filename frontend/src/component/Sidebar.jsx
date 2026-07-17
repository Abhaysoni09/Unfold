import { useNavigate } from 'react-router-dom';
import axios from "axios"
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  TicketPercent,
  LogOut,
} from "lucide-react";
import { API_URL } from "../config/api";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/seller",
  },
  {
    title: "Products",
    icon: ShoppingBag,
    path: "/seller/products",
  },
  {
    title: "Orders",
    icon: Package,
    path: "/seller/orders",
  },
  {
    title: "Customers",
    icon: Users,
    path: "/seller/customers",
  },
  {
    title: "Brands",
    icon: TicketPercent,
    path: "/seller/brands",
  },
];
const Sidebar = () => {
  const { setUser } = useAuth();
    const Navigate = useNavigate()
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
  return (
    <div>
        <aside
      className="w-64 h-screen bg-white border-r border-[#D7E6DA] shadow-md flex flex-col"
      style={{ fontFamily: "Fraunces" }}
    >
      <div className="px-6 py-6 border-b border-[#D7E6DA]">
        <h1 className="text-3xl font-bold text-[#163832]">
          UNFOLD
        </h1>

        <p className="text-sm text-[#5F7A6B] mt-1">
          Admin Dashboard
        </p>
      </div>
      <nav className="flex-1 px-4 py-6">

        <p className="text-xs uppercase tracking-wider text-[#8AA295] mb-4 px-3">
          Main Menu
        </p>

        <div className="space-y-2">

          {menuItems.map((item) => {

            const Icon = item.icon;

            return (

              <NavLink
                key={item.title}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-[#163832] text-white shadow-lg"
                      : "text-[#235347] hover:bg-[#EBF3EC] hover:text-[#163832]"
                  }`
                }
              >

                <Icon size={20} />

                {item.title}

              </NavLink>

            );

          })}

        </div>

      </nav>
      <div className="border-t border-[#D7E6DA] p-4">

        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition"
        >
          <LogOut size={20} />
          Logout
        </button>

      </div>

    </aside>
    </div>
  )
}

export default Sidebar