const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  rating: Number,
  comment: String
}, { timestamps: true });

module.exports = mongoose.model("Review", ReviewSchema);
