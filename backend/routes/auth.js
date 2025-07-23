const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Check if admin exists
router.get('/check-admin', async (req, res) => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    res.json({ isAdminRegistered: !!adminExists });
  } catch (error) {
    res.status(500).json({ message: 'Error checking admin status', error: error.message });
  }
});

// Admin Signup
router.post('/register-admin', async (req, res) => {
  const { username, password } = req.body;
  
  // Check if admin already exists
  const existingAdmin = await User.findOne({ role: 'admin' });
  if (existingAdmin) {
    return res.status(400).json({ message: 'An admin user already exists' });
  }

  // Check if username is taken
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ message: 'Username already taken' });
  }

  // Create new admin user
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ 
    username, 
    password: hashedPassword, 
    role: 'admin' 
  });
  
  try {
    await user.save();
    const token = jwt.sign({ id: user._id, role: user.role }, 'secret', {
      expiresIn: '1h',
    });
    res.status(201).json({ message: 'Admin created', token, role: user.role });
  } catch (error) {
    res.status(500).json({ message: 'Error creating admin', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user._id, role: user.role }, 'secret', {
    expiresIn: '1h',
  });
  res.json({ token, role: user.role, id: user._id });
});

module.exports = router;