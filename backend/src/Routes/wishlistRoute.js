
const {
    addToWishlist,
    removeFromWishlist,
    getWishlist,
} = require( "../Controllers/wishlistcontroller.js");

const authMiddleware =require("../Middleware/authmiddleware.js");

const express = require("express");
const router = express.Router();

router.get("/", authMiddleware.authmiddle, getWishlist);

router.post("/:productId", authMiddleware.authmiddle, addToWishlist);

router.delete("/:productId", authMiddleware.authmiddle, removeFromWishlist);

module.exports = router;