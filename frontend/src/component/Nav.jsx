import { useAuth } from "../context/AuthContext";
import {Users,ShoppingCart,Heart} from "lucide-react"
import { Link } from "react-router-dom";

const Nav = () => {
  const { user } = useAuth();


  return (
    <div>
         <header className="bg-white shadow-sm sticky top-0 z-50">
  <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
    <h1
      className="text-3xl font-bold text-[#163832]"
      style={{ fontFamily: "Fraunces" }}
    >
      UNFOLD
    </h1>
    <nav className="hidden md:flex items-center gap-8 text-[#235347] font-medium">
      <Link to="/">
      <a
        className="hover:text-[#163832] transition"
      >
        Home
      </a>
      </Link>
      <Link to="/products">
      <a
        className="hover:text-[#163832] transition"
      >
        Products
      </a>
      </Link>
      <Link to="/about">
      <a
        className="hover:text-[#163832] transition"
      >
        About
      </a>
      </Link>
    </nav>
    
    <div className="flex gap-3">
      <Link to="/wishlist">
    <Heart/>
</Link>
      <Link
      to="/cart"
      className="px-3"
      >
      <ShoppingCart/>
      </Link>
      {
        user ? (
          <Link className="cursor-pointer"
          to="/profile"
          >
          <Users/>
          </Link>
        ) : (

          <>
             <Link to="/login" className=" bg-[#163832] hover:bg-[#0f2924] text-white text-center p-2 rounded-lg transition">Login</Link>
             <Link to="/register" className=" bg-[#163832] hover:bg-[#0f2924] text-white text-center p-2 rounded-lg transition">Sign Up</Link>
          </>

        )
      }
    </div>
  </div>
</header>
    </div>
  )
}

export default Nav