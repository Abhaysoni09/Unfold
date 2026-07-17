const express = require("express")
const  productcontrollers = require("../Controllers/product.controllers")
const brandcontrollers = require("../Controllers/brand.controllers")
const ordercontroller = require("../Controllers/order.controllers")
const {authRole} = require("../Middleware/rolemiddleware")
const addresscontroller = require("../Controllers/address.controllers")
const sellerordercontroller = require("../Controllers/sellerordercontroller");
const cartcontrollers = require("../Controllers/cart.controllers")
const authcontroller = require("../Middleware/authmiddleware")
const multer = require("multer")
const router = express.Router()
const upload = multer({storage:multer.memoryStorage()})


router.post("/createproducts",authRole("seller"), upload.array("images",14),productcontrollers.createproduct)
router.get("/products",authRole("seller"),productcontrollers.allproducts)
router.delete("/products/:id",authRole("seller"),productcontrollers.deleteproduct)
router.get("/getproducts",productcontrollers.getallproduct)
router.get("/getallproducts",productcontrollers.getallproductsforproduct)
router.get("/products/:id",productcontrollers.getproduct)
router.put("/products/:id",authRole("seller"),productcontrollers.updateproduct)


router.post("/brands",authRole("seller"),upload.single("logo",1),brandcontrollers.createbrand)
router.get("/brands",authRole("seller"),brandcontrollers.allbrands)
router.delete("/brands/:id",authRole("seller"),brandcontrollers.deletebrand)
router.patch("/brands/:id",authRole("seller"),brandcontrollers.updatebrand)


router.post("/cart",authRole("user"),cartcontrollers.addcart)
router.get("/cart",authRole("user"),cartcontrollers.getcart)
router.put("/cart/:id",authRole("user"),cartcontrollers.updatequantity)
router.delete("/cart/:id",authRole("user"),cartcontrollers.removeitem)


router.get("/address",authRole("user"),addresscontroller.getAddresses)
router.post("/address",authRole("user"),addresscontroller.addAddress)
router.delete("/address/:id",authRole("user"),addresscontroller.deleteAddress)
router.put("/address/:id",authRole("user"),addresscontroller.updateAddress)
router.patch("/address/:id/default",authRole("user"),addresscontroller.setDefaultAddress)


router.post("/order",authRole("user"),ordercontroller.placeOrder)
router.get("/order",authRole("user"),ordercontroller.allorders)
router.get("/myorder",authRole("user"),ordercontroller.myorder)
router.get("/sellerorder",authRole("seller"),ordercontroller.sellerorders)
router.patch("/order/:id",authRole("user"),ordercontroller.updateorderstatus)
router.get("/order/:id",authRole("user"),ordercontroller.getorder)


router.get("/seller/orders", authRole("seller"), sellerordercontroller.getSellerOrders);
router.patch("/seller/orders/:id/status",authRole("seller"), sellerordercontroller.updateOrderStatus);
router.get("/customers", authRole("seller"), sellerordercontroller.getSellerCustomers);
router.get("/seller/dashboard", authRole("seller"), sellerordercontroller.getdashboard);



module.exports = router