const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    // Temporary field to support frontend FarmerID
    FarmerID: {
      type: Number,
      required: true
    },

    // ✅ ADD: Proper farmer reference (DO NOT REMOVE FarmerID)
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false
    },

    // Product fields
    name: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      required: false
    },
    description: {
      type: String,
      required: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
