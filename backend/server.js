const app = require("./src/app")
const connectdb = require("./src/db/db")
require("dotenv").config()
connectdb()

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log("Server is running on port 3000")
})