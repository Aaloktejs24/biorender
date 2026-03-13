const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const User = require('../models/User');

// Get current user profile from DB
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching profile' });
  }
});

// Update profile in DB
router.post('/update', authenticateToken, async (req, res) => {
  const { name, bio } = req.body;
  console.log(`📝 Attempting to update profile for user ${req.user.id}:`, { name, bio });
  try {
    const user = await User.findByIdAndUpdate(
        req.user.id, 
        { name, bio }, 
        { new: true, runValidators: true }
    );
    if (!user) {
      console.error(`❌ User not found for update: ${req.user.id}`);
      return res.status(404).json({ error: 'User not found' });
    }
    console.log(`✅ Profile updated successfully for: ${user.email}`);
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    console.error('❌ Server error updating profile:', error.message, error.stack);
    res.status(500).json({ error: 'Server error updating profile', detail: error.message });
  }
});

module.exports = router;
