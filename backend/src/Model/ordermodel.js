const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
{
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    products:[
        {
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Product",
                required:true
            },


            seller: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
              required: true,
            },

            quantity:{
                type:Number,
                required:true
            },

            selectedColor:String,
            selectedSize:String,

            price:{
                type:Number,
                required:true
            }
        }
    ],

    address:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Address",
        required:true
    },

    totalAmount:{
        type:Number,
        required:true
    },

    paymentMethod:{
        type:String,
        enum:["COD","Online"],
        default:"COD"
    },

    orderStatus:{
        type:String,
        enum:["Pending","Confirmed","Packed","Shipped","Delivered","Cancelled"],
        default:"Pending"
    }

},{
    timestamps:true
});

module.exports = mongoose.model("Order", orderSchema);