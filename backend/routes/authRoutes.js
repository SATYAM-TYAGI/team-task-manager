const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/role");

const router = express.Router();

// this function made to check user signup
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ msg: "fill all required fields" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ msg: "email already used" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const userData = new User({
      name,
      email,
      password: hashed,
      role: role === "admin" ? "admin" : "member",
    });

    // here we are saving data in db
    await userData.save();

    res.json({ msg: "signup done" });
  } catch (err) {
    res.status(500).json({ msg: "server problem" });
  }
});

// this function is made to check user login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await User.findOne({ email });

    if (!userData) {
      return res.status(400).json({ msg: "invalid creds" });
    }

    const isOk = await bcrypt.compare(password, userData.password);
    if (!isOk) {
      return res.status(400).json({ msg: "invalid creds" });
    }

    const token = jwt.sign(
      { id: userData._id, role: userData.role, name: userData.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: userData._id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
      },
    });
  } catch (err) {
    res.status(500).json({ msg: "server problem" });
  }
});

// admin can get users for assign task/member
router.get("/users", auth, roleCheck(["admin"]), async (req, res) => {
  try {
    const userList = await User.find().select("-password");
    res.json(userList);
  } catch (err) {
    res.status(500).json({ msg: "server problem" });
  }
});

module.exports = router;
