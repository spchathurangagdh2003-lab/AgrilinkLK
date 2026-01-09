const express = require("express");
const router = express.Router();

const Product = require("../models/Product");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");

/**
 * GET all products (for buyer dashboard)
 */
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find()
      .populate("farmer", "name district phone");

    res.json(products);
  } catch (error) {
    console.error("Fetch products error:", error);
    res.status(500).json({ message: "Failed to fetch products", error: error.message });
  }
});

/**
 * PLACE ORDER
 */
router.post("/orders", protect(["buyer"]), async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const product = await Product.findById(productId).populate("farmer", "name email phone");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!product.farmer) {
      return res.status(400).json({ message: "Product has no farmer assigned" });
    }

    if (product.quantity < quantity) {
      return res.status(400).json({ message: "Not enough stock available" });
    }

    const order = await Order.create({
      buyer: req.user._id,
      farmer: product.farmer._id,
      product: product._id,
      quantity,
      totalPrice: product.price * quantity
    });

    // reduce product quantity after order
    product.quantity -= quantity;
    await product.save();

    res.status(201).json({
      message: "Order placed successfully",
      order
    });

  } catch (error) {
    console.error("Order creation error:", error);
    res.status(400).json({ message: "Order failed", error: error.message });
  }
});

/**
 * GET buyer orders
 */
router.get("/orders", protect(["buyer"]), async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .populate("product")
      .populate("farmer", "name phone district");

    res.json(orders);
  } catch (error) {
    console.error("Fetch buyer orders error:", error);
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
});

module.exports = router;
