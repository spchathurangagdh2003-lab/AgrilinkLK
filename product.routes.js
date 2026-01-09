const router = require("express").Router();
const Product = require("../models/Product");


router.get("/", async (req, res) => {
  try {
    const { category, name } = req.query;

    let filter = {};

    if (category) {
      filter.category = category;
    }

    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }

    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products" });
  }
});


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

