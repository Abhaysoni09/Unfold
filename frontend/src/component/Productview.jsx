import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {Link} from "react-router-dom"
import Addtocartbutton from "./Addtocartbutton";
import { API_URL } from "../config/api";

const Productview = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [products, setproducts] = useState([])
  
  const fetchproducts=async()=>{
    try{
      const res = await axios.get(`${API_URL}/getproducts`,{
        withCredentials:true
      })
      console.log(res.data.products)
      setproducts(res.data.products)
    }
    catch(err){
      console.log(err)
    }
  }
  useEffect(() => {
    fetchproducts()
  }, [])
  

  const reviews = [
    {
      id:1,
      name:"Rahul Sharma",
      rating:5,
      comment:"Bag quality is amazing. Material feels premium and delivery was fast."
    },
    {
      id:2,
      name:"Ankit Verma",
      rating:4,
      comment:"Good product, comfortable and spacious. Worth the price."
    },
    {
      id:3,
      name:"Priya Singh",
      rating:5,
      comment:"Loved the design. Perfect for daily use."
    },
    {
      id:4,
      name:"Priyanshu Singh",
      rating:3,
      comment:"Loved the design. Perfect for daily use."
    }
  ]
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/products/${id}`,
        {
            withCredentials:true
        });
        setProduct(res.data.products);
        setSelectedImage(res.data.products.images[0]);
      } catch (err) {
        console.log(err);
      }
    };
    fetchProduct();
  }, [id]);
  if(!product){
    return (
      <div className="p-10 text-center">
        Loading Product...
      </div>
    )
  }
  return (
    <div className="max-w-7xl mx-auto px-6 py-10" style={{fontFamily:"Fraunces"}}>
      <div className="grid md:grid-cols-2 gap-10">
        <div>
          <div className="h-[450px] rounded-2xl overflow-hidden bg-gray-100">
            <img
              src={selectedImage}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-3 mt-4">
            {
              product.images?.map((img,index)=>(
                <img
                  key={index}
                  src={img}
                  onClick={()=>setSelectedImage(img)}
                  className={`w-20 h-20 rounded-lg object-cover cursor-pointer border ${
                    selectedImage===img 
                    ? "border-[#163832]" 
                    : "border-gray-200"
                  }`}
                />
              ))
            }
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500">
            {product.category}
          </p>
          <h1 className="text-4xl font-bold text-[#163832] mt-2">
            {product.title}
          </h1>
          <p className="text-3xl font-bold mt-5">
            ₹{product.price}
          </p>
          <p className="text-gray-600 mt-5 leading-7">
            {product.description}
          </p>
          <div className="mt-6">

            <h3 className="font-semibold">
              Colors
            </h3>
            <div className="flex gap-3 mt-2">
              {
                product.colors?.map((color,index)=>(
                  <button
                    key={index}
                    onClick={()=>setSelectedColor(color)}
                    className={`px-4 py-2 rounded-lg border ${
                      selectedColor===color
                      ?"bg-[#163832] text-white"
                      :"bg-white"
                    }`}
                  >
                    {color}
                  </button>
                ))
              }
            </div>
          </div>
          <div className="mt-6">
            <h3 className="font-semibold">
              Sizes
            </h3>
            <div className="flex gap-3 mt-2">
              {
                product.sizes?.map((size,index)=>(
                  <button
                    key={index}
                    onClick={()=>setSelectedSize(size)}
                    className={`px-4 py-2 rounded-lg border ${
                      selectedSize===size
                      ?"bg-[#163832] text-white"
                      :"bg-white"
                    }`}
                  >
                    {size}
                  </button>
                ))
              }
            </div>
          </div>
          <p className="mt-6 text-green-700">
            {
              product.stock > 0
              ? `${product.stock} items available`
              : "Out of Stock"
            }
          </p>
          <button
            disabled={product.stock===0}
            className="mt-8 w-full bg-[#163832] text-white py-3 rounded-xl text-lg hover:bg-[#0B2B26] transition disabled:bg-gray-400"
          >
          <Addtocartbutton
          productId={product._id}
          />
          </button>
        </div>
      </div>

      <div className="mt-12 border-t pt-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#163832]">
          Customer Reviews
        </h2>
        <div className="text-right">
          <p className="text-3xl font-bold text-[#163832]">
            4.7 ⭐
          </p>
          <p className="text-sm text-gray-500">
            Based on 120 reviews
          </p>
        </div>
      </div>
      <button
        className="mt-6 px-5 py-2 bg-[#163832] text-white rounded-lg hover:bg-[#0B2B26]"
      >
        Write a Review
      </button>
      <div className="mt-8 space-y-5">
        {
          reviews.map((review)=>(
            <div
              key={review.id}
              className="bg-white shadow-sm border rounded-xl p-5"
            >
              <div className="flex justify-between">
                <h3 className="font-semibold text-gray-800">
                  {review.name}
                </h3>
                <div className="text-yellow-500">
                  {"⭐".repeat(review.rating)}
                </div>
              </div>
              <p className="text-gray-600 mt-3">
                {review.comment}
              </p>
              <p className="text-xs text-gray-400 mt-3">
                2 days ago
              </p>
            </div>
          ))
        }
      </div>
      </div>

      <h1 className="text-3xl p-5">Similar Products</h1>

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
  )
}

export default Productview;