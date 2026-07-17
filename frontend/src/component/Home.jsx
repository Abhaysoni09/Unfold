import axios from "axios";
import { ArrowRight, ShoppingBag, Star } from "lucide-react";
import { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../config/api";
import Addtocartbutton from "./Addtocartbutton";
import image from "../assets/Untitled design.png"
import ImageScroller from "./ImageScroller";
const Home = () => {
const [products, setproducts] = useState([])

const fetchproducts=async()=>{
  try{
    const res = await axios.get(`${API_URL}/getproducts`,{
      withCredentials:true
    })
    setproducts(res.data.products)
  }
  catch(err){
    console.log(err)
  }
}
useEffect(() => {
  fetchproducts()
}, [])


  return (
    <div style={{fontFamily:"Fraunces"}}>
       <section className="bg-[#EBF3EC] min-h-screen flex items-center px-6 md:px-16 py-12">
      <div className="max-w-7xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-6">
            <Star size={16} className="text-yellow-500 fill-yellow-500" />
            <span className="text-sm text-[#235347] font-medium">
              Premium Quality Bags
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight text-[#051F20]">
            Carry Your
            <span className="block text-[#235347]">
              Style Everywhere
            </span>
          </h1>

          <p className="mt-6 text-lg text-gray-600 max-w-lg">
            Discover elegant backpacks, travel bags, laptop bags and everyday
            essentials crafted for comfort, durability and modern lifestyle.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">

            <Link to="/products">
            <button className="flex items-center gap-2 bg-[#163832] text-white px-7 py-4 rounded-full font-semibold hover:bg-[#235347] transition">
              Shop Now
              <ArrowRight size={18}/>
            </button>
            </Link>
            <Link to="/products">
            <button className="flex items-center gap-2 border border-[#163832] text-[#163832] px-7 py-4 rounded-full font-semibold hover:bg-white transition">
              <ShoppingBag size={18}/>
              Explore Collection
            </button>
            </Link>
          </div>
          <div className="mt-12 grid grid-cols-3 gap-6 max-w-md">

            <div>
              <h3 className="text-3xl font-bold text-[#051F20]">
                500+
              </h3>
              <p className="text-sm text-gray-500">
                Designs
              </p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-[#051F20]">
                10K+
              </h3>
              <p className="text-sm text-gray-500">
                Customers
              </p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-[#051F20]">
                4.9
              </h3>
              <p className="text-sm text-gray-500">
                Rating
              </p>
            </div>
          </div>
        </div>
        <div className="relative flex justify-center">
          <div className="absolute w-72 h-72 md:w-96 md:h-96 bg-[#8EB69B] rounded-full blur-sm opacity-40">
          </div>
          <img
            src={image}
            alt="Premium Bag"
            className="relative z-10 w-full max-w-md object-contain drop-shadow-2xl rounded-2xl"
          />
          <div className="absolute bottom-8 left-4 md:left-0 bg-white rounded-2xl shadow-xl p-4 z-20">

            <div className="flex items-center gap-3">

              <div className="w-12 h-12 bg-[#EBF3EC] rounded-xl flex items-center justify-center">
                <ShoppingBag 
                  className="text-[#235347]"
                  size={24}
                />
              </div>
              <div>
                <p className="font-semibold text-[#051F20]">
                  Premium Leather Bag
                </p>
                <p className="text-sm text-gray-500">
                  New Collection
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section>
      <ImageScroller/>
    </section>


      <h1 className="text-3xl text-[#163832] font-bold p-5 border-b-2 border-[#163832]">New Arrival</h1>
      
      <div className="grid p-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
  {products.map((product) => (
    <div
      key={product._id}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden"
    >
      <div className="h-40 overflow-hidden">
        <img
          src={product.images?.[0]}
          alt={product.title}
          className="w-full h-full object-cover hover:scale-105 transition"
        />
      </div>
      <div className="p-3">

        <p className="text-xs text-gray-500">
          {product.category}
        </p>

        <h2 className="text-sm font-semibold text-gray-800 mt-1 truncate">
          {product.title}
        </h2>


        <div className="flex justify-between items-center mt-2">
          <span className="text-lg font-bold text-green-700">
            ₹{product.price}
          </span>

          <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-full">
            {product.stock > 0 ? "Stock" : "Out"}
          </span>
        </div>
        <div className="flex gap-1 mt-2">
          {product.colors?.slice(0,3).map((color,index)=>(
            <span
              key={index}
              className="text-[10px] bg-gray-100 px-2 py-1 rounded"
            >
              {color}
            </span>
          ))}
        </div>
        <div className="flex gap-3 mt-5">
          <Link className="flex-1 bg-[#163832] hover:bg-[#0f2924] text-white text-center py-2 rounded-lg transition"
          to={`/productview/${product._id}`}
          >
          <button>
            View
          </button>
          </Link>
            <Addtocartbutton
            productId={product._id}
            />
        </div>

      </div>
    </div>
  ))}
      </div>
    </div>
  );
};

export default Home;