const cartmodel = require("../Model/cartmodel");
const productmodel = require("../Model/productmodel");

async function addcart(req, res) {
  try {
    const userId = req.user.id;
    const { productId, quantity, selectedColor, selectedSize } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    const qty = Number(quantity) > 0 ? Number(quantity) : 1;

    const product = await productmodel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await cartmodel.findOne({ user: userId });

    if (!cart) {
      cart = await cartmodel.create({
        user: userId,
        items: [
          {
            product: productId,
            quantity: qty,
            selectedColor,
            selectedSize,
            price: product.price,
          },
        ],
        totalPrice: product.price * qty,
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) =>
          item.product.toString() === productId &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += qty;
      } else {
        cart.items.push({
          product: productId,
          quantity: qty,
          selectedColor,
          selectedSize,
          price: product.price,
        });
      }

      cart.totalPrice = cart.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
      await cart.save();
    }

    res.status(200).json({ message: "Product added to cart", cart });
  } catch (error) {
    console.log(error);
    const statusCode = error.name === "CastError" ? 400 : 500;
    res.status(statusCode).json({ message: error.message });
  }
}

async function getcart(req, res) {
  try {
    const cart = await cartmodel
      .findOne({ user: req.user.id })
      .populate("items.product");

    res.status(200).json({ message: "User cart", cart: cart || { items: [], totalPrice: 0 } });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}

async function updatequantity(req, res) {
  try {
    const { id } = req.params;           // ✅ matches route's :id
    const { quantity } = req.body;

    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be a positive integer" });
    }

    const cart = await cartmodel.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.id(id);      
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    item.quantity = quantity;
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    await cart.save();
    await cart.populate("items.product");

    res.status(200).json({ message: "Quantity updated", cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}

async function removeitem(req, res) {
  try {
    const { id } = req.params;          

    const cart = await cartmodel.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter((item) => item._id.toString() !== id);
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    await cart.save();

    await cart.populate("items.product");

    res.status(200).json({ message: "Item removed", cart });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}

module.exports = { addcart, removeitem, updatequantity, getcart };