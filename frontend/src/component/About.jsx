import {
  Award,
  Heart,
  ShieldCheck,
  Truck,
  Users,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import aboutunfold from "../assets/aboutunfold.jpeg"
import ourcollections from "../assets/ourcollections.jpeg"

const About = () => {

  const features = [
    {
      icon: Award,
      title: "Premium Quality",
      desc: "Every bag is crafted with carefully selected materials for long-lasting performance.",
    },
    {
      icon: ShieldCheck,
      title: "Built To Last",
      desc: "Durable designs created to handle your everyday adventures.",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      desc: "Safe and quick delivery right to your doorstep.",
    },
    {
      icon: Heart,
      title: "Customer First",
      desc: "Your satisfaction and style are our biggest priorities.",
    },
  ];


  return (
    <div className="bg-[#EBF3EC] min-h-screen">
      <section className="px-6 md:px-16 py-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[#235347] font-semibold uppercase tracking-wider">
              About UNFOLD
            </p>
            <h1 className="text-5xl md:text-6xl font-bold text-[#051F20] mt-4 leading-tight">
              More Than A Bag,
              <span className="block text-[#235347]">
                It's Your Journey
              </span>
            </h1>
            <p className="text-gray-600 mt-6 text-lg leading-relaxed">
              At UNFOLD, we believe a bag is not just an accessory.
              It carries your dreams, your work, your adventures and your
              everyday moments.
            </p>
            <p className="text-gray-600 mt-4 text-lg leading-relaxed">
              We design premium bags that combine modern aesthetics,
              comfort and durability for people who move forward.
            </p>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-[#8EB69B] rounded-3xl rotate-6 opacity-40">
            </div>
            <img
              src={aboutunfold}
              alt="About UNFOLD"
              className="relative z-10 w-full h-[500px] object-cover rounded-3xl shadow-xl"
            />
          </div>
        </div>
      </section>
      <section className="bg-white py-16 px-6 md:px-16">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <h2 className="text-4xl font-bold text-[#163832]">
              10K+
            </h2>
            <p className="text-gray-500 mt-2">
              Happy Customers
            </p>
          </div>
          <div>
            <h2 className="text-4xl font-bold text-[#163832]">
              500+
            </h2>
            <p className="text-gray-500 mt-2">
              Bag Designs
            </p>
          </div>
          <div>
            <h2 className="text-4xl font-bold text-[#163832]">
              4.9★
            </h2>
            <p className="text-gray-500 mt-2">
              Customer Rating
            </p>
          </div>
          <div>
            <h2 className="text-4xl font-bold text-[#163832]">
              24/7
            </h2>
            <p className="text-gray-500 mt-2">
              Support
            </p>
          </div>
        </div>
      </section>
      <section className="px-6 md:px-16 py-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="bg-[#163832] rounded-3xl p-10 text-white">
            <Users size={45} className="mb-6 text-[#8EB69B]" />
            <h2 className="text-4xl font-bold">
              Our Mission
            </h2>
            <p className="mt-5 text-gray-300 leading-relaxed">
              Our mission is to create bags that inspire confidence.
              Whether you are a student, professional or traveler,
              UNFOLD creates products designed for your lifestyle.
            </p>
          </div>
          <div>
            <img
              src={ourcollections}
              alt="Our Collection"
              className="w-full h-[350px] object-cover rounded-3xl shadow-lg"
            />
          </div>
        </div>
      </section>
      <section className="bg-white px-6 md:px-16 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#235347] font-semibold">
              WHY CHOOSE US
            </p>
            <h2 className="text-4xl md:text-5xl font-bold text-[#051F20] mt-3">
              Designed For Your Lifestyle
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {features.map((item,index)=>{
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="bg-[#EBF3EC] rounded-3xl p-6 hover:-translate-y-2 transition duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#163832] flex items-center justify-center">
                    <Icon className="text-white" size={24}/>
                  </div>
                  <h3 className="mt-5 text-xl font-bold text-[#051F20]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-gray-600 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="px-6 md:px-16 py-20">
        <div className="max-w-5xl mx-auto bg-[#163832] rounded-3xl p-10 md:p-16 text-center text-white">
          <Star className="mx-auto text-[#8EB69B]" size={45}/>
          <h2 className="text-4xl md:text-5xl font-bold mt-5">
            Carry Your Story With UNFOLD
          </h2>
          <p className="text-gray-300 mt-5 max-w-xl mx-auto">
            Explore our collection of premium bags designed for every journey.
          </p>
          <Link to="/products">
          <button className="mt-8 bg-white text-[#163832] px-8 py-3 rounded-full font-semibold hover:bg-[#EBF3EC] transition">
            Explore Collection
          </button>
          </Link>
          
        </div>
      </section>
    </div>
  );
};


export default About;