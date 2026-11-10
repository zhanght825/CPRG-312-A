
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const RefreshToken = require('../models/RefreshToken');

const REFRESH_DAYS = Number(process.env.REFRESH_TOKEN_DAYS || 7);

if (!Number.isFinite(REFRESH_DAYS) || REFRESH_DAYS <= 0) {
    throw new Error('Invalid REFRESH_TOKEN_DAYS');
}

const secureCookie = process.env.NODE_ENV === 'production';

const accessCookieOptions = {
    httpOnly: true,
    secure: secureCookie,
    sameSite: 'lax',
    path: '/'
};

const refreshCookieOptions = {
    ...accessCookieOptions,
    path: '/api/auth'
};

function createAccessToken(user) {
    return jwt.sign(
        {
            id: user._id.toString(),
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || '15m',
            algorithm: 'HS256'
        }
    );
}

function hashToken(token) {
    return crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');
}

async function createRefreshToken(user) {
    const token = crypto.randomBytes(48).toString('hex');

    await RefreshToken.create({
        user: user._id,
        tokenHash: hashToken(token),
        expiresAt: new Date(
            Date.now() + REFRESH_DAYS * 24 * 60 * 60 * 1000
        )
    });

    return token;
}

function setAuthCookies(res, accessToken, refreshToken) {
    res.cookie('accessToken', accessToken, {
        ...accessCookieOptions,
        maxAge: 15 * 60 * 1000
    });

    res.cookie('refreshToken', refreshToken, {
        ...refreshCookieOptions,
        maxAge: REFRESH_DAYS * 24 * 60 * 60 * 1000
    });
}

function clearAuthCookies(res) {
    res.clearCookie('accessToken', accessCookieOptions);
    res.clearCookie('refreshToken', refreshCookieOptions);
}

module.exports = {
    createAccessToken,
    createRefreshToken,
    hashToken,
    setAuthCookies,
    clearAuthCookies
};
