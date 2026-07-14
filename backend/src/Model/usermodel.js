const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role:{
        type:String,
        enum:["user","seller","admin"],
        default:"user"
    },
    avatar:{
        type: String,
    },
    status:{
        type:String,
        enum:["user","admin"],
        default:"user"
    },
    isverified:{
        type:Boolean,
        default:false
    }
},{timestamps:true})

module.exports = mongoose.model("User", userSchema)
