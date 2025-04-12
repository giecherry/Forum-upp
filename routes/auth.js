const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt"); 
const User = require("../models/user.model");
const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(401)
        .json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to login" });
  }
});

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({
      username,
    });
    if (existingUser) {
      return res
        .status(400)
        .json({
          error: "Username already exists",
        });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );
    const user = new User({
      username,
      password: hashedPassword,
      isAdmin: false,
    });
    await user.save();
    res
      .status(201)
      .json({
        message: "User registered successfully",
      });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to register user" });
  }
});

router.post("/logout", (req, res) => {
  res.json({
    message: "User logged out successfully",
  });
});

module.exports = router;
