import axios from "axios";

const Addtocartbutton = ({productId}) => {


  const handleAddCart = async()=>{

    try{

      await axios.post(
        "http://localhost:3000/api/cart",
        {
          productId,
          quantity:1
        },
        {
          withCredentials:true
        }
      );


      alert("Added to cart");


    }catch(err){

      console.log(err);
      alert("Please Login/Register to Order")

    }

  }


  return (

    <button
      onClick={handleAddCart}
      className="flex-1 bg-[#163832] hover:bg-[#0f2924] text-white text-center py-2 rounded-lg transition"
    >
      Add Cart
    </button>

  )

}


export default Addtocartbutton;