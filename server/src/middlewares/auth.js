const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function ensureAuthenticated(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        const token = req.cookies?.accessToken ||
            (authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null);

        if (!token) {
            return res.status(401).json({
                message: 'Authentication required'
            });
        }


        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET,
            { algorithms: ['HS256'] }
        );

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                message: 'Invalid user'
            });
        }

        req.user = user;
        next();
    } catch {
        return res.status(401).json({
            message: 'Invalid or expired token'
        });
    }
}

function ensureAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        return next();
    }

    return res.status(403).json({
        message: 'Access denied: Admin only'
    });
}

module.exports = {
    ensureAuthenticated,
    ensureAdmin
};
