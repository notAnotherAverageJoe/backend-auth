const express = require("express");

const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  collectAllUsers,
  userFoundWithEmail,
  registerUer,
  userLogin,
  updateUser,
  deleteUser,
} = require("../controllers/userControllers");

router.get("/users", authMiddleware, collectAllUsers);
router.post("/users", userFoundWithEmail);
router.post("/users/register", registerUer);
router.post("/users/login", userLogin);
router.patch("/users/:id", updateUser);
router.delete("/users", authMiddleware, deleteUser);

module.exports = router;
