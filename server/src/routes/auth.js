const express = require('express');
const argon2 = require('argon2');
const User = require('../models/User');

const router = express.Router();
const crypto = require('crypto');
const RefreshToken = require('../models/RefreshToken');
const passport = require('passport');
const {
    createAccessToken,
    createRefreshToken,
    hashToken,
    setAuthCookies,
    clearAuthCookies
} = require('../utils/tokens');

// Register a new user
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                message: 'All fields are required'
            });
        }

        if (
            typeof username !== 'string' ||
            typeof email !== 'string' ||
            typeof password !== 'string' ||
            username.trim().length < 3 ||
            username.trim().length > 50 ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
            password.length < 8 ||
            Buffer.byteLength(password, 'utf8') > 1024
        ) {
            return res.status(400).json({
                message: 'Invalid registration information'
            });
        }

        const existingUser = await User.findOne({
            $or: [
                { username: username.trim() },
                { email: email.trim().toLowerCase() }
            ]
        });

        if (existingUser) {
            return res.status(409).json({
                message: 'Username or email is already registered'
            });
        }

        // Hash password before saving
        const hashedPassword = await argon2.hash(password, {
            type: argon2.argon2id
        });

        const user = new User({
            username: username.trim(),
            email: email.trim().toLowerCase(),
            password: hashedPassword,
            role: 'user'
        });

        await user.save();

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        console.error('Registration error:', err);

        if (err.code === 11000) {
            return res.status(409).json({
                message: 'Username or email is already registered'
            });
        }

        res.status(500).json({
            message: 'Server error'
        });
    }
});

// Login with email and password
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (
            typeof email !== 'string' ||
            typeof password !== 'string' ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                message: 'Email and password are required'
            });
        }

        // Find user by email
        const user = await User.findOne({
            email: email.trim().toLowerCase()
        });

        // Verify password
        if (!user || !user.password) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }

        const isValid = await argon2.verify(
            user.password,
            password
        );

        if (!isValid) {
            return res.status(401).json({
                message: 'Invalid email or password'
            });
        }


// Generate access and refresh tokens
const accessToken = createAccessToken(user);
const refreshToken = await createRefreshToken(user);

// Save tokens in HttpOnly cookies
setAuthCookies(res, accessToken, refreshToken);

res.status(200).json({
    message: 'Login successful',
    user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
    }
});


    } catch (err) {
        console.error('Login error:', err);

        res.status(500).json({
            message: 'Server error'
        });
    }
});


// Refresh access token
router.post('/refresh', async (req, res) => {
    try {
        const token = req.cookies.refreshToken;

        if (!token) {
            return res.status(401).json({
                message: 'Refresh token required'
            });
        }

        const oldToken = await RefreshToken.findOneAndDelete({
            tokenHash: hashToken(token),
            expiresAt: { $gt: new Date() }
        });

        if (!oldToken) {
            clearAuthCookies(res);

            return res.status(401).json({
                message: 'Invalid or expired refresh token'
            });
        }

        const user = await User.findById(oldToken.user);

        if (!user) {
            clearAuthCookies(res);

            return res.status(401).json({
                message: 'User not found'
            });
        }

        // Create a new token pair
        const accessToken = createAccessToken(user);
        const refreshToken = await createRefreshToken(user);

        setAuthCookies(res, accessToken, refreshToken);

        res.json({
            message: 'Token refreshed successfully'
        });

    } catch (err) {
        console.error('Refresh token error:', err);

        res.status(500).json({
            message: 'Server error'
        });
    }
});


// Logout
router.post('/logout', async (req, res) => {
    try {
        const token = req.cookies.refreshToken;

        if (token) {
            await RefreshToken.deleteOne({
                tokenHash: hashToken(token)
            });
        }

        clearAuthCookies(res);

        res.json({
            message: 'Logout successful'
        });

    } catch (err) {
        console.error('Logout error:', err);

        res.status(500).json({
            message: 'Server error'
        });
    }
});

// Get CSRF token
router.get('/csrf', (req, res) => {
    if (!req.session.csrfToken) {
        req.session.csrfToken = crypto.randomBytes(32).toString('hex');
    }

    res.json({
        csrfToken: req.session.csrfToken
    });
});


// Login with Google
router.get('/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })
);

// Google OAuth callback
router.get('/google/callback', (req, res, next) => {
    passport.authenticate('google', {
        session: false
    }, async (err, user) => {
        if (err) {
            return next(err);
        }

        if (!user) {
            return res.redirect('/cprg-312/login?error=google');
        }

        try {
            // Regenerate session ID after successful login
            req.session.regenerate(async (sessionErr) => {
                if (sessionErr) {
                    return next(sessionErr);
                }

                try {
                    // Create a new CSRF token
                    req.session.csrfToken =
                        crypto.randomBytes(32).toString('hex');

                    await new Promise((resolve, reject) => {
                        req.session.save(saveErr => {
                            if (saveErr) reject(saveErr);
                            else resolve();
                        });
                    });

                    // Generate JWT and refresh token
                    const accessToken = createAccessToken(user);
                    const refreshToken = await createRefreshToken(user);

                    setAuthCookies(res, accessToken, refreshToken);

                    res.redirect('/cprg-312/dashboard');

                } catch (error) {
                    next(error);
                }
            });

        } catch (error) {
            next(error);
        }
    })(req, res, next);
});


module.exports = router;
