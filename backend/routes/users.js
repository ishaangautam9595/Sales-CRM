const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');
const router = express.Router();

// Create User
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  const { username, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword, role });
  await user.save();
  res.json({ message: 'User created', user });  
});

// Get public user data (authenticated users)
router.get('/public', authMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('_id username');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching public user data', error: error.message });
  }
});

// Get public user data (current user only, for non-admins)
router.get('/user-public', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('username _id');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json([user]); // Return as array to match GET /api/users format
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user data', error: error.message });
  }
});

// Get All Users
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Update User
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const { username, password, role } = req.body;
  const updateData = { username, role };
  if (password) updateData.password = await bcrypt.hash(password, 10);
  const user = await User.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
  });
  res.json({ message: 'User updated', user });
});

// Delete User
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: 'User deleted' });
});

// Get assigned leads for a specific user
router.get('/:userId/assigned-leads', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    // Users can only access their own assigned leads; Admins can access any user's leads
    if (req.user.role !== 'admin' && req.user.id !== userId) {
      return res.status(403).json({ message: 'Unauthorized to access this user’s leads' });
    }

    const leads = await Lead.find({ assignedTo: userId })
      .populate('assignedTo', 'username')
      .populate('emailCampaigns.sentBy', 'username')
      .populate('statusHistory.assignedTo', 'username');
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assigned leads', error: error.message });
  }
});

module.exports = router;