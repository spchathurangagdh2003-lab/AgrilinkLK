const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Review = require("../models/Review");
const User = require("../models/User");

/**
 * FARMER DASHBOARD
 */
router.get("/dashboard", protect(["farmer"]), async (req, res) => {
  try {
    const farmer = await User.findById(req.user._id).select("-password");

    const productsCount = await Product.countDocuments({
      farmer: req.user._id
    });

    const ordersCount = await Order.countDocuments({
      farmer: req.user._id
    });

    res.json({
      farmer,
      stats: {
        products: productsCount,
        orders: ordersCount
      }
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET farmer products
 */
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find({ FarmerID: 1 }); // temporary farmerId for testing
    const mapped = products.map(p => ({
      ProductName: p.name,
      Category: p.category,
      Price: p.price,
      Quantity: p.quantity,
      Unit: p.unit,
      Description: p.description,
      FarmerID: p.FarmerID
    }));
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
});


/**
 * ADD product
 */
router.post("/products", protect(["farmer"]), async (req, res) => {
  try {
    const product = await Product.create({
      farmer: req.user._id,
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      quantity: req.body.quantity,
      district: req.body.district,
    });

    res.status(201).json(product);
  } catch {
    res.status(400).json({ message: "Product creation failed" });
  }
});

/**
 * UPDATE product
 */
router.put("/products/:id", protect(["farmer"]), async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, farmer: req.user._id },
      req.body,
      { new: true }
    );

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch {
    res.status(400).json({ message: "Update failed" });
  }
});

/**
 * DELETE product
 */
router.delete("/products/:id", protect(["farmer"]), async (req, res) => {
  try {
    const deleted = await Product.findOneAndDelete({
      _id: req.params.id,
      farmer: req.user._id
    });

    if (!deleted)
      return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted successfully" });
  } catch {
    res.status(500).json({ message: "Delete failed" });
  }
});

/**
 * GET farmer orders
 */
router.get("/orders", protect(["farmer"]), async (req, res) => {
  try {
    const orders = await Order.find({ farmer: req.user._id })
      .populate("buyer", "name email phone")
      .populate("product", "name price");

    res.json(orders);
  } catch {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

/**
 * UPDATE order status
 */
router.put("/orders/:id/status", protect(["farmer"]), async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, farmer: req.user._id },
      { status: req.body.status },
      { new: true }
    );

    if (!order)
      return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch {
    res.status(400).json({ message: "Status update failed" });
  }
});

/**
 * GET reviews
 */
router.get("/reviews", protect(["farmer"]), async (req, res) => {
  try {
    const reviews = await Review.find({ farmer: req.user._id })
      .populate("buyer", "name");

    res.json(reviews);
  } catch {
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
});

module.exports = router;
