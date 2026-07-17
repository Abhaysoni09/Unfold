const express = require("express")
const authmiddleware = require("../Middleware/authmiddleware")
const {authRole} = require("../Middleware/rolemiddleware")
const authcontroller = require("../Controllers/auth.controllers")
const router = express.Router()

router.post("/register", authcontroller.register)
router.post("/login", authcontroller.login)
router.post("/logout",authmiddleware.authmiddle, authcontroller.logout)
router.get("/me",authmiddleware.authmiddle, authcontroller.me)
router.put("/profile",authRole("user"),authcontroller.updateprofile)


module.exports = router