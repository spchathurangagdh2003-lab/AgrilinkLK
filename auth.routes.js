const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


router.post("/register", async (req, res) => {
  try {
    const { FullName, Email, Password, Role, Phone, District } = req.body;

    if (!FullName || !Email || !Password || !Role || !Phone || !District) {
      return res.status(400).json({ message: "All required fields missing" });
    }

    const existingUser = await User.findOne({ email: Email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    await User.create({
      name: FullName,
      email: Email,
      password: hashedPassword,
      role: Role.toLowerCase(), 
      phone: Phone,
      district: District
    });

    res.status(201).json({ message: "Registered successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Registration failed",
      error: error.message
    });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { Email, Password } = req.body;

    if (!Email || !Password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email: Email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(Password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      role: user.role,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        district: user.district
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Login failed",
      error: error.message
    });
  }
});

module.exports = router;

