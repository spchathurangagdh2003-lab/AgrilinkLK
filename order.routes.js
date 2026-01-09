const router = require("express").Router();
const Order = require("../models/Order");
const Product = require("../models/Product");
const { protect } = require("../middleware/authMiddleware");

/**
 * CREATE ORDER (Buyer only)
 * POST /api/orders
 */
router.post("/", protect(["buyer"]), async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    // Find product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check stock
    if (product.quantity < quantity) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    // Create order
    const order = await Order.create({
      buyer: req.user._id,
      farmer: product.FarmerID || product.farmer,
      product: product._id,
      quantity,
      totalPrice: product.price * quantity,
      status: "Pending"
    });

    // Reduce product quantity
    product.quantity -= quantity;
    await product.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({
      message: "Order creation failed",
      error: error.message
    });
  }
});

/**
 * GET MY ORDERS (Buyer & Farmer)
 * GET /api/orders/my
 */
router.get("/my", protect(), async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ buyer: req.user._id }, { farmer: req.user._id }]
    })
      .populate("product")
      .populate("buyer", "name email phone")
      .populate("farmer", "name email phone");

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

/**
 * CANCEL ORDER (Buyer only)
 * PUT /api/orders/:id/cancel
 */
router.put("/:id/cancel", protect(["buyer"]), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Only owner can cancel
    if (order.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Already cancelled
    if (order.status === "Cancelled") {
      return res.status(400).json({ message: "Order already cancelled" });
    }

    // Restore product quantity
    const product = await Product.findById(order.product);
    if (product) {
      product.quantity += order.quantity;
      await product.save();
    }

    // Update order status
    order.status = "Cancelled";
    await order.save();

    res.json({ message: "Order cancelled successfully", order });
  } catch (error) {
    res.status(500).json({
      message: "Failed to cancel order",
      error: error.message
    });
  }
});

module.exports = router;
