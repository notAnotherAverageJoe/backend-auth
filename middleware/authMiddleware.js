const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
  const authHead = req.header("Authorization");
  if (!authHead) {
    return res.status(401).json({ error: "Access Denied, No Token!" });
  }
  //   "Bearer token_value"
  const token = authHead.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Access denied, invalid token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid token" });
  }
};

module.exports = authMiddleware;
