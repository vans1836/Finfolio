const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

// --- SIGNUP ROUTE ---
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  console.log("📩 Signup request received:", { name, email });

  try {
    const existing = await User.findOne({ email });
    console.log("🔍 Existing user check:", existing);

    if (existing) {
      console.log("⚠️ User already exists");
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const savedUser = await User.create({ name, email, password: hashed });

    console.log("✅ User saved to MongoDB:", savedUser);

    res.status(201).json({
      message: 'Signup successful',
      user: {
        _id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email
      }
    });
  } catch (err) {
    console.error("❌ Signup error:", err.message);
    res.status(500).json({ error: 'Signup failed', details: err.message });
  }
});

// --- LOGIN ROUTE ---
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log("🔐 Login attempt for:", email);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ No user found for email:", email);
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log("❌ Incorrect password for:", email);
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });
    console.log("✅ Login successful:", email);

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
});

module.exports = router;
