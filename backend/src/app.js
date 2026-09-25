const express = require("express")
const authroute = require("./Routes/auth.routes")
const productroute = require("./Routes/product.routes")
const cookieparser = require("cookie-parser")
const cors = require("cors")
const wishlistRoutes = require("../src/Routes/wishlistRoute")

const app = express()
app.use(express.json())
app.use(cookieparser())
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://unfold-rose.vercel.app"
    ],
    credentials: true
}));

app.use("/api/auth", authroute)
app.use("/api",productroute)
app.use("/api/wishlist", wishlistRoutes);

module.exports = app