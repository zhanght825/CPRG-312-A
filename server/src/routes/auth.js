const express = require('express');
const crypto = require('crypto');
const argon2 = require('argon2');
const passport = require('passport');
const { rateLimit } = require('express-rate-limit');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const { createAccessToken, createRefreshToken, hashToken, setAuthCookies, clearAuthCookies } = require('../utils/tokens');
const router = express.Router();
const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20,
    standardHeaders: 'draft-8', legacyHeaders: false,
    message: { message: 'Too many attempts; try again later' } });
const registerLimiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 10,
    standardHeaders: 'draft-8', legacyHeaders: false });
const BASE = process.env.APP_BASE_PATH || '/cprg-312';
function publicUser(user) {
    return { id: String(user._id), username: user.username, email: user.email, role: user.role };
}
function regenerate(req) {
    return new Promise((resolve, reject) => req.session.regenerate(err => err ? reject(err) : resolve()));
}
function saveSession(req) {
    return new Promise((resolve, reject) => req.session.save(err => err ? reject(err) : resolve()));
}
async function establishLogin(req, res, user) {
    await regenerate(req); // Prevent session fixation
    req.session.csrfToken = crypto.randomBytes(32).toString('hex');
    await saveSession(req);
    const accessToken = createAccessToken(user);
    const refreshToken = await createRefreshToken(user);
    setAuthCookies(res, accessToken, refreshToken);
    return { user: publicUser(user), csrfToken: req.session.csrfToken };
}
router.get('/csrf', (req, res) => {
    if (!req.session.csrfToken) req.session.csrfToken = crypto.randomBytes(32).toString('hex');
    res.json({ csrfToken: req.session.csrfToken });
});
router.post('/register', registerLimiter, async (req, res, next) => {
    try {
        const { username, email, password } = req.body || {};
        if (typeof username !== 'string' || typeof email !== 'string' || typeof password !== 'string' ||
            username.trim().length < 3 || username.trim().length > 50 ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8 ||
            Buffer.byteLength(password, 'utf8') > 1024) {
            return res.status(400).json({ message: 'Check username, email and password (8+ characters)' });
        }
        const safeUsername = username.trim();
        const safeEmail = email.trim().toLowerCase();
        const passwordHash = await argon2.hash(password, { type: argon2.argon2id });
        const user = await User.create({ username: safeUsername, email: safeEmail,
            password: passwordHash, role: 'user' });
        res.status(201).json({ message: 'Account created', user: publicUser(user) });
    } catch (err) { next(err); }
});
router.post('/login', loginLimiter, async (req, res, next) => {
    try {
        const { email, password } = req.body || {};
        if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
            return res.status(400).json({ message: 'Email and password required' });
        }
        const user = await User.findOne({ email: email.trim().toLowerCase() });
        // Do not reveal whether an email address exists.
        if (!user || !user.password) return res.status(401).json({ message: 'Invalid email or password' });
        if (user.lockedUntil && user.lockedUntil > new Date()) {
            return res.status(429).json({ message: 'Too many attempts. Please try again later.' });
        }
        const valid = await argon2.verify(user.password, password);
        if (!valid) {
            // Atomic counter avoids lost updates under simultaneous login attempts.
            const updated = await User.findByIdAndUpdate(user._id, { $inc: { failedLoginAttempts: 1 } }, { new: true });
            if (updated.failedLoginAttempts >= 5) {
                await User.updateOne({ _id: user._id }, { $set: {
                    lockedUntil: new Date(Date.now() + 15 * 60 * 1000), failedLoginAttempts: 0 } });
            }
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        await User.updateOne({ _id: user._id }, { $set: { failedLoginAttempts: 0, lockedUntil: null } });
        const data = await establishLogin(req, res, user);
        res.json({ message: 'Login successful', ...data });
    } catch (err) { next(err); }
});
router.post('/refresh', async (req, res, next) => {
    try {
        const token = req.cookies?.refreshToken;
        if (!token) return res.status(401).json({ message: 'Login required' });
        const oldToken = await RefreshToken.findOneAndDelete({
            tokenHash: hashToken(token), expiresAt: { $gt: new Date() }
        });
        if (!oldToken) {
            clearAuthCookies(res);
            return res.status(401).json({ message: 'Refresh token expired or already used' });
        }
        const user = await User.findById(oldToken.user);
        if (!user) {
            clearAuthCookies(res);
            return res.status(401).json({ message: 'Login required' });
        }
        const accessToken = createAccessToken(user);
        const refreshToken = await createRefreshToken(user);
        setAuthCookies(res, accessToken, refreshToken);
        res.json({ message: 'Tokens refreshed', user: publicUser(user) });
    } catch (err) { next(err); }
});
router.post('/logout', async (req, res, next) => {
    try {
        const token = req.cookies?.refreshToken;
        if (token) await RefreshToken.deleteOne({ tokenHash: hashToken(token) });
        if (req.session) await new Promise((resolve, reject) => req.session.destroy(err => err ? reject(err) : resolve()));
        clearAuthCookies(res);
        res.clearCookie('portfolio.sid', {
            path: process.env.NODE_ENV === 'production' ? BASE + '/' : '/',
            httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax'
        });
        res.json({ message: 'Logged out' });
    } catch (err) { next(err); }
});
router.get('/google', loginLimiter, (req, res, next) => {
    if (!passport._strategy('google')) return res.status(503).json({ message: 'Google sign-in is not configured' });
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});
router.get('/google/callback', (req, res, next) => {
    if (!passport._strategy('google')) return res.status(503).json({ message: 'Google sign-in is not configured' });
    passport.authenticate('google', { session: false }, async (err, user) => {
        if (err) return next(err);
        if (!user) return res.redirect(BASE + '/login?error=google');
        try {
            await establishLogin(req, res, user);
            res.redirect(BASE + '/dashboard');
        } catch (error) { next(error); }
    })(req, res, next);
});
module.exports = router;
