const ordermodel = require("../Model/ordermodel");
const productmodel = require("../Model/productmodel");
const cartmodel = require("../Model/cartmodel")
const addressmodel = require("../Model/addressmodel")

const placeOrder = async (req, res) => {
  try {
    const { addressId, paymentMethod } = req.body;
    const cart = await cartmodel.findOne({
      user: req.user.id,
    }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }
    const address = await addressmodel.findOne({
      _id: addressId,
      user: req.user.id,
    });

    if (!address) {
      return res.status(404).json({
        message: "Address not found",
      });
    }


    let orderProducts = [];
    let totalAmount = 0;
    for (const item of cart.items) {
      const product = item.product;
      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `${product.title} is out of stock`,
        });
      }
      orderProducts.push({
        product: product._id,
        seller: product.createrId,
        quantity: item.quantity,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize,
        price: product.price,
      });
      totalAmount += product.price * item.quantity;
      product.stock -= item.quantity;
      await product.save();
    }
    const order = await ordermodel.create({
      user: req.user.id,
      products: orderProducts,
      address:address._id,
      totalAmount,
      paymentMethod,
    });
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();
    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
};


const myorder = async (req, res) => {
  try {
    const orders = await ordermodel.find({
      user: req.user.id,
    })
      .populate("products.product")
      .populate("address");

    res.status(200).json({
      orders,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const sellerorders = async (req, res) => {
  try {
    const sellerId = req.user.id;

    const orders = await ordermodel.find({
      "products.seller": sellerId,
    })
      .populate("user", "username email")
      .populate("products.product");

    const sellerOrders = orders.map((order) => ({
      ...order.toObject(),
      products: order.products.filter(
        (item) => item.seller.toString() === sellerId
      ),
    }));

    res.status(200).json({
      orders: sellerOrders,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const allorders = async (req, res) => {
  try {
    const orders = await ordermodel.find()
      .populate("user", "username email")
      .populate("products.product")
      .populate("address");

    res.status(200).json({
      orders,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};
async function getorder(req,res){
  const id = req.params.id
  const order = await ordermodel.findById(id)
  .populate("products.product")
      .populate("products.seller")
      .populate("address");


  res.status(200).json({
    message:"Order fetch",
    order
  })
}


const updateorderstatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const order = await ordermodel.findById(id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.orderStatus = orderStatus;
    await order.save();

    res.status(200).json({
      message: "Order status updated",
      order,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
};


module.exports = {placeOrder,getorder,myorder,sellerorders,allorders,updateorderstatus}