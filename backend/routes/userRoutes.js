const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

// Get Profile
router.get('/profile', auth, async (req, res) => {
  const user = global.db.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ user });
});

// Update Profile
router.post('/update', auth, async (req, res) => {
  const { name, bio } = req.body;
  const userIndex = global.db.users.findIndex(u => u.id === req.user.id);

  if (userIndex === -1) return res.status(404).json({ error: 'User not found' });

  global.db.users[userIndex] = {
    ...global.db.users[userIndex],
    name: name || global.db.users[userIndex].name,
    bio: bio !== undefined ? bio : global.db.users[userIndex].bio
  };

  console.log(`✅ Profile updated (In-Memory): ${global.db.users[userIndex].email}`);
  res.json({ user: global.db.users[userIndex] });
});

module.exports = router;
