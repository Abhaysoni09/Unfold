import {
  Instagram,
  Facebook,
  Twitter,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from "lucide-react";


const Footer = () => {
    const thankyou=()=>{
        alert("Thankyou for Subscribing us.")
    }
  return (
    <footer className="bg-[#051F20] text-white px-6 md:px-16 pt-16">
      <div className="max-w-7xl mx-auto">
        <div className="bg-[#163832] rounded-3xl p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold">
              Stay Updated With UNFOLD
            </h2>
            <p className="text-gray-300 mt-3 max-w-md">
              Subscribe to get updates about new collections, exclusive offers
              and premium bag launches.
            </p>
          </div>
          <div className="flex bg-white rounded-full p-2 w-full md:w-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-5 py-3 outline-none text-gray-700 rounded-full"
            />
            <button onClick={thankyou} className="bg-[#235347] px-6 rounded-full flex items-center gap-2 font-semibold">
              Subscribe
              <ArrowRight size={18}/>
            </button>
          </div>
        </div>
        <div className="grid md:grid-cols-4 gap-10 py-14">
          <div>
            <h1 className="text-3xl font-bold tracking-wide">
              UNFOLD
            </h1>
            <p className="text-gray-400 mt-4 leading-relaxed">
              Premium bags designed for modern lifestyles. Carry confidence,
              comfort and style wherever you go.
            </p>
            <div className="flex gap-3 mt-6">
              <a className="w-10 h-10 rounded-full bg-[#163832] flex items-center justify-center hover:bg-[#235347] transition">
                <Instagram size={18}/>
              </a>
              <a className="w-10 h-10 rounded-full bg-[#163832] flex items-center justify-center hover:bg-[#235347] transition">
                <Facebook size={18}/>
              </a>
              <a className="w-10 h-10 rounded-full bg-[#163832] flex items-center justify-center hover:bg-[#235347] transition">
                <Twitter size={18}/>
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-5">
              Shop
            </h3>
            <ul className="space-y-3 text-gray-400">
              <li className="hover:text-white cursor-pointer">
                Backpacks
              </li>
              <li className="hover:text-white cursor-pointer">
                Laptop Bags
              </li>
              <li className="hover:text-white cursor-pointer">
                Travel Bags
              </li>
              <li className="hover:text-white cursor-pointer">
                Handbags
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-5">
              Company
            </h3>
            <ul className="space-y-3 text-gray-400">
              <li className="hover:text-white cursor-pointer">
                About Us
              </li>
              <li className="hover:text-white cursor-pointer">
                Contact
              </li>
              <li className="hover:text-white cursor-pointer">
                Privacy Policy
              </li>
              <li className="hover:text-white cursor-pointer">
                Terms & Conditions
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-5">
              Contact
            </h3>
            <div className="space-y-4 text-gray-400">
              <p className="flex gap-3 items-center">
                <MapPin size={18} className="text-[#8EB69B]"/>
                Lucknow, India
              </p>
              <p className="flex gap-3 items-center">
                <Phone size={18} className="text-[#8EB69B]"/>
                +91 98765 43210
              </p>
              <p className="flex gap-3 items-center">
                <Mail size={18} className="text-[#8EB69B}"/>
                support@unfold.com
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-400 text-sm">
          <p>
            © {new Date().getFullYear()} UNFOLD. All rights reserved.
          </p>
          <div className="flex gap-4">
            <span>
              Secure Payment
            </span>
            <span>
              •
            </span>
            <span>
              Fast Delivery
            </span>
            <span>
              •
            </span>
            <span>
              Premium Quality
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};


export default Footer;