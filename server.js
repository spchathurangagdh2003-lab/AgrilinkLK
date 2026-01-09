require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path"); // <- add this
const connectDB = require("./db");

const app = express();

connectDB();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "../frontend")));

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/farmer", require("./routes/farmer.routes"));
app.use("/api/buyer", require("./routes/buyer.routes"));
app.use("/api/products", require("./routes/product.routes"));
app.use("/api/orders", require("./routes/order.routes"));
app.use("/api/admin", require("./routes/admin.routes"));

app.get("/", (req, res) => {
  res.send("AgriLink LK API Running 🚀");
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Server Error",
    error: err.message
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});

