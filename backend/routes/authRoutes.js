const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/login', async (req, res) => {
  const { credential } = req.body;
  
  try {
    const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    if (!payload) return res.status(400).json({ error: 'Invalid Google token' });

    const { sub: googleId, email, name, picture } = payload;

    // Use global.db instead of User model
    let user = global.db.users.find(u => u.googleId === googleId);

    if (!user) {
        user = {
            id: Date.now().toString(), // Generate a fake ID
            googleId,
            email,
            name,
            picture,
            role: 'user',
            bio: ''
        };
        global.db.users.push(user);
        console.log(`🆕 New user created (In-Memory): ${email}`);
    } else {
        user.picture = picture; // Sync picture
        console.log(`👤 Existing user logged in (In-Memory): ${email}`);
    }

    const token = jwt.sign(
        { id: user.id, email: user.email, name: user.name }, 
        process.env.JWT_SECRET || 'fallback_secret', 
        { expiresIn: '1d' }
    );
    
    res.json({ user, token });
  } catch (error) {
    console.error('❌ Auth failed:', error.message);
    res.status(500).json({ error: 'Auth failed' });
  }
});

module.exports = router;
