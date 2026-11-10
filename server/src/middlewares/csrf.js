const crypto = require('crypto');
function csrfProtection(req, res, next) {
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
    const stored = req.session?.csrfToken;
    const sent = req.get('x-csrf-token');
    if (typeof stored !== 'string' || typeof sent !== 'string') {
        return res.status(403).json({ message: 'Invalid CSRF token' });
    }
    const a = Buffer.from(stored);
    const b = Buffer.from(sent);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
        return res.status(403).json({ message: 'Invalid CSRF token' });
    }
    next();
}
module.exports = csrfProtection;
