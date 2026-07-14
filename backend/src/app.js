const express = require("express")
const authroute = require("./Routes/auth.routes")
const productroute = require("./Routes/product.routes")
const cookieparser = require("cookie-parser")
const cors = require("cors")

const app = express()
app.use(express.json())
app.use(cookieparser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use("/api/auth", authroute)
app.use("/api",productroute)

module.exports = app