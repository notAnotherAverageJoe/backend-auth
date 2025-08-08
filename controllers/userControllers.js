require("dotenv").config();
const db = require("../config/db");
const userModels = require("../models/userModels");
const jwt = require("jsonwebtoken");
const auth = require("bcryptjs");

const collectAllUsers = async (req, res) => {
  try {
    const users = await userModels.searchForUsers();
    res.json(users);
  } catch (error) {
    console.error("Failed to collect all users", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const userFoundWithEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "email required" });
    }
    const user = await userModels.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "No user found" });
    }
    return res.json({ user });
  } catch (error) {
    console.error("failed to find user with that email", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const registerUer = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await userModels.getUserByEmail(email);
    if (existingUser) {
      console.log("email aleady in use");
    }
    const newUser = await userModels.createUser(username, email, password);
    return res
      .status(201)
      .json({ message: "Successfully created new user", user: newUser });
  } catch (error) {
    console.error("Failed to create user", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const userLogin = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await userModels.getUserByEmail(email);
    if (!user) {
      res.status(401).json({ message: "Invalid email or password" });
    }
    const matching = await auth.compare(password, user.password);
    if (!matching) {
      return res.status(401).json({ error: "invalid password or email" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    // debugging only
    console.log({
      userId: user.id,
      userEmail: user.email,
      name: user.username,
    });
    return res.status(200).json({ message: "Successfully logged in!", token });
  } catch (error) {
    console.error("Login failed", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;
  try {
    const user = await userModels.userChanges(id, {
      username,
      email,
      password,
    });

    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    return res.json({ user });
  } catch (error) {
    console.error("Failed to update user", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const deleteUser = async (req, res) => {
  const id = req.user.id;
  try {
    const user = await userModels.deleteUserById(id);
    if (!user || user.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User deleted" });
  } catch (error) {
    console.error("delete controller failed to remove user", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
module.exports = {
  collectAllUsers,
  userFoundWithEmail,
  registerUer,
  userLogin,
  updateUser,
  deleteUser,
};
