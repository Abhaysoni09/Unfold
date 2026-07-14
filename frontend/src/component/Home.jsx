import axios from "axios";
import { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import Addtocartbutton from "./Addtocartbutton";
import Nav from "./Nav";
const Home = () => {
const [products, setproducts] = useState([])

const fetchproducts=async()=>{
  try{
    const res = await axios.get("http://localhost:3000/api/getproducts",{
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
      <Nav/>
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