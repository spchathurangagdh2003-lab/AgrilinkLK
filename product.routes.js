const router = require("express").Router();
const Product = require("../models/Product");

/**
 * GET ALL PRODUCTS (Buyer + Public)
 * Supports filtering by category and product name
 * Example:
 * /api/products?category=Vegetable&name=Tomato
 */
router.get("/", async (req, res) => {
  try {
    const { category, name } = req.query;

    let filter = {};

    // Filter by category
    if (category) {
      filter.category = category;
    }

    // Filter by product name (case-insensitive)
    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }

    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

/**
 * CREATE PRODUCT (Farmer)
 * POST /api/products/add
 */
router.post("/add", async (req, res) => {
  try {
    const product = await Product.create({
      name: req.body.ProductName,
      category: req.body.Category,
      price: req.body.Price,
      quantity: req.body.Quantity,
      unit: req.body.Unit,
      description: req.body.Description,
      FarmerID: req.body.FarmerID
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create product",
      error: error.message
    });
  }
});

/**
 * DELETE PRODUCT (Farmer)
 */
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete product",
      error: error.message
    });
  }
});

/**
 * UPDATE PRODUCT (Farmer)
 */
router.put("/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.ProductName,
        category: req.body.Category,
        price: req.body.Price,
        quantity: req.body.Quantity,
        unit: req.body.Unit,
        description: req.body.Description
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update product",
      error: error.message
    });
  }
});

module.exports = router;
