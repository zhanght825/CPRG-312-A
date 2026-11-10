const express = require('express');
const {
    ensureAuthenticated,
    ensureAdmin
} = require('../middlewares/auth');

const router = express.Router();

// Authenticated users only
router.get('/profile', ensureAuthenticated, (req, res) => {
    res.json({
        message: 'User profile',
        user: {
            id: req.user._id,
            username: req.user.username,
            email: req.user.email,
            role: req.user.role
        }
    });
});

// Shared dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.json({
        message: `Welcome ${req.user.username}`,
        role: req.user.role,
        features: req.user.role === 'admin'
            ? ['profile', 'projects', 'admin']
            : ['profile', 'projects']
    });
});

// Admin only
router.get(
    '/admin',
    ensureAuthenticated,
    ensureAdmin,
    (req, res) => {
        res.json({
            message: 'Welcome to the Admin Dashboard'
        });
    }
);

module.exports = router;
