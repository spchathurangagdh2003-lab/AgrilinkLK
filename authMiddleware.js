const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = (roles = []) => {
  return async (req, res, next) => {
    try {
      let token = req.headers.authorization;

      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }

      if (token.startsWith("Bearer ")) {
        token = token.split(" ")[1];
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        return res.status(401).json({ message: "User no longer exists" });
      }

      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};

