const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
  {
    sellerId:{
      type: mongoose.Schema.Types.ObjectId,
      ref:"User"
    },
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    logo: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Brand", brandSchema);