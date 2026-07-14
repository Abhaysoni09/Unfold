const ordermodel = require("../Model/ordermodel");
const productmodel = require("../Model/productmodel")

const VALID_STATUSES = ["Pending", "Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"];
const LOW_STOCK_THRESHOLD = 5;

async function getSellerOrders(req, res) {
  try {
    const sellerId = req.user.id;

    // find orders that contain at least one product belonging to this seller
    const orders = await ordermodel
      .find({ "products.seller": sellerId })
      .populate("products.product")
      .populate("address")
      .populate("user", "username email phone")
      .sort({ createdAt: -1 });

    const sellerOrders = orders.map((order) => {
      const sellerItems = order.products.filter(
        (item) => item.seller?.toString() === sellerId
      );

      const sellerTotal = sellerItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      return {
        _id: order._id,
        user: order.user,
        address: order.address,
        orderStatus: order.orderStatus,
        paymentMethod: order.paymentMethod,
        createdAt: order.createdAt,
        items: sellerItems,
        sellerTotal,
      };
    });

    res.status(200).json({ message: "Seller orders", orders: sellerOrders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}

async function updateOrderStatus(req, res) {
  try {
    const sellerId = req.user.id;
    const { id } = req.params;
    const { status } = req.body;

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const order = await ordermodel.findOne({
      _id: id,
      "products.seller": sellerId,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.orderStatus = status;
    await order.save();

    res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    console.log(error);
    const statusCode = error.name === "CastError" ? 400 : 500;
    res.status(statusCode).json({ message: error.message });
  }
}


async function getSellerCustomers(req, res) {
  try {
    const sellerId = req.user.id;
 
    const orders = await ordermodel
      .find({ "products.seller": sellerId })
      .populate("user", "username email phone createdAt")
      .sort({ createdAt: -1 });
 
    const customerMap = new Map();
 
    for (const order of orders) {
      const buyer = order.user;
      if (!buyer) continue;
 
      const sellerItems = order.products.filter(
        (item) => item.seller?.toString() === sellerId
      );
 
      const orderTotalForSeller = sellerItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
 
      const key = buyer._id.toString();
 
      if (!customerMap.has(key)) {
        customerMap.set(key, {
          _id: buyer._id,
          username: buyer.username,
          email: buyer.email,
          phone: buyer.phone,
          customerSince: buyer.createdAt,
          totalOrders: 0,
          totalSpent: 0,
          lastOrderDate: order.createdAt,
        });
      }
 
      const entry = customerMap.get(key);
      entry.totalOrders += 1;
      entry.totalSpent += orderTotalForSeller;
 
      if (new Date(order.createdAt) > new Date(entry.lastOrderDate)) {
        entry.lastOrderDate = order.createdAt;
      }
    }
 
    const customers = Array.from(customerMap.values()).sort(
      (a, b) => new Date(b.lastOrderDate) - new Date(a.lastOrderDate)
    );
 
    res.status(200).json({ message: "Seller customers", customers });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}

 
async function getdashboard(req, res) {
  try {
    const sellerId = req.user.id;
 
    const [totalProducts, lowStockProducts, orders] = await Promise.all([
      productmodel.countDocuments({ createrId: sellerId }),
      productmodel
        .find({ createrId: sellerId, stock: { $lte: LOW_STOCK_THRESHOLD } })
        .select("title stock images")
        .sort({ stock: 1 })
        .limit(5),
      ordermodel
        .find({ "products.seller": sellerId })
        .populate("products.product", "title images")
        .populate("user", "username email")
        .sort({ createdAt: -1 }),
    ]);
 
    let totalRevenue = 0;
    const customerSet = new Set();
    const statusCounts = {
      Pending: 0,
      Confirmed: 0,
      Packed: 0,
      Shipped: 0,
      Delivered: 0,
      Cancelled: 0,
    };
 
    const recentOrders = [];
 
    for (const order of orders) {
      const sellerItems = order.products.filter(
        (item) => item.seller?.toString() === sellerId
      );
 
      const orderTotalForSeller = sellerItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
 
      totalRevenue += orderTotalForSeller;
 
      if (order.user) customerSet.add(order.user._id.toString());
 
      if (statusCounts[order.orderStatus] !== undefined) {
        statusCounts[order.orderStatus] += 1;
      }
 
      if (recentOrders.length < 5) {
        recentOrders.push({
          _id: order._id,
          buyer: order.user?.username || "Unknown",
          items: sellerItems.length,
          total: orderTotalForSeller,
          status: order.orderStatus,
          createdAt: order.createdAt,
        });
      }
    }
 
    res.status(200).json({
      message: "Seller dashboard",
      stats: {
        totalProducts,
        totalOrders: orders.length,
        totalRevenue,
        totalCustomers: customerSet.size,
        statusCounts,
      },
      recentOrders,
      lowStockProducts,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}


module.exports = { getSellerOrders, updateOrderStatus,getSellerCustomers,getdashboard};