const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const RefreshToken = require('../models/RefreshToken');
const REFRESH_DAYS = Number(process.env.REFRESH_TOKEN_DAYS || 7);
const BASE = process.env.APP_BASE_PATH || '/cprg-312';
const prod = process.env.NODE_ENV === 'production';
const common = { httpOnly: true, secure: prod, sameSite: 'lax' };
const accessPath = prod ? BASE + '/' : '/';
const refreshPath = prod ? BASE + '/api/auth' : '/api/auth';
function createAccessToken(user) {
    return jwt.sign({ id: String(user._id), role: user.role }, process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '15m', algorithm: 'HS256' });
}
function hashToken(token) { return crypto.createHash('sha256').update(token).digest('hex'); }
async function createRefreshToken(user) {
    const token = crypto.randomBytes(48).toString('hex');
    await RefreshToken.create({
        user: user._id,
        tokenHash: hashToken(token),
        expiresAt: new Date(Date.now() + REFRESH_DAYS * 86400000)
    });
    return token;
}
function setAuthCookies(res, accessToken, refreshToken) {
    res.cookie('accessToken', accessToken, { ...common, path: accessPath, maxAge: 900000 });
    res.cookie('refreshToken', refreshToken, { ...common, path: refreshPath, maxAge: REFRESH_DAYS * 86400000 });
}
function clearAuthCookies(res) {
    res.clearCookie('accessToken', { ...common, path: accessPath });
    res.clearCookie('refreshToken', { ...common, path: refreshPath });
}
module.exports = { createAccessToken, createRefreshToken, hashToken, setAuthCookies, clearAuthCookies };
