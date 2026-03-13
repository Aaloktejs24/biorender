const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post('/login', async (req, res) => {
  const { credential } = req.body;
  
  try {
    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    if (!payload) {
        return res.status(400).json({ error: 'Invalid Google token' });
    }

    const { sub: googleId, email, name, picture } = payload;

    // Find or Create user in Database
    let user = await User.findOne({ googleId });

    if (!user) {
        user = await User.create({
            googleId,
            email,
            name,
            picture
        });
        console.log(`🆕 New user created: ${email}`);
    } else {
        // Update profile picture if Google info changed, but keep their chosen display name
        user.picture = picture;
        await user.save();
        console.log(`👤 Existing user logged in: ${email}`);
    }

    // Generate our own local JWT for the session using database fields
    const token = jwt.sign(
        { id: user._id, email: user.email, name: user.name }, 
        process.env.JWT_SECRET || 'fallback_secret', 
        { expiresIn: '1d' }
    );
    
    res.json({ 
        user: {
            id: user._id,
            email: user.email,
            name: user.name,
            picture: user.picture,
            role: user.role,
            bio: user.bio
        }, 
        token 
    });
  } catch (error) {
    console.error('❌ Google verification or DB save failed:', error.message, error.stack);
    res.status(500).json({ error: 'Internal server error during authentication', detail: error.message });
  }
});

module.exports = router;
