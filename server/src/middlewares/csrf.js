
const crypto = require('crypto');

function csrfProtection(req, res, next) {
    const safeMethods = ['GET', 'HEAD', 'OPTIONS'];

    if (safeMethods.includes(req.method)) {
        return next();
    }

    const sessionToken = req.session?.csrfToken;
    const requestToken = req.headers['x-csrf-token'];

    if (
        typeof sessionToken !== 'string' ||
        typeof requestToken !== 'string'
    ) {
        return res.status(403).json({
            message: 'Invalid CSRF token'
        });
    }

    const expected = Buffer.from(sessionToken, 'utf8');
    const received = Buffer.from(requestToken, 'utf8');

    if (
        expected.length !== received.length ||
        !crypto.timingSafeEqual(expected, received)
    ) {
        return res.status(403).json({
            message: 'Invalid CSRF token'
        });
    }

    next();
}

module.exports = csrfProtection;
