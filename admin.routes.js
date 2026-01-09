const router = require("express").Router();
const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { protect } = require("../middleware/authMiddleware");

/**
 * GET ALL BUYERS
 */
router.get("/buyers", protect(["admin"]), async (req, res) => {
  try {
    const buyers = await User.find({ role: "buyer" }).select("-password");
    res.json(buyers);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch buyers", error: error.message });
  }
});

/**
 * GET ALL FARMERS
 */
router.get("/farmers", protect(["admin"]), async (req, res) => {
  try {
    const farmers = await User.find({ role: "farmer" }).select("-password");
    res.json(farmers);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch farmers", error: error.message });
  }
});

/**
 * GET ALL ORDERS (with buyer, farmer, product info)
 */
router.get("/orders", protect(["admin"]), async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("buyer", "name email phone")
      .populate({
        path: "product",
        select: "name category price quantity unit description",
        populate: { path: "FarmerID", select: "name email phone" }
      })
      .populate("farmer", "name email phone");

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders", error: error.message });
  }
});

/**
 * VERIFY USER
 */
router.put("/verify/:id", protect(["admin"]), async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { verified: true });
    res.json({ message: "User verified" });
  } catch (error) {
    res.status(500).json({ message: "Failed to verify user", error: error.message });
  }
});

module.exports = router;
