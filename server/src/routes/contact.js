const express = require('express');
const ContactMessage = require('../models/ContactMessage');
const { ensureAuthenticated } = require('../middlewares/auth');

const router = express.Router();

router.use(ensureAuthenticated);

// Save my contact message
router.post('/messages', async (req, res, next) => {
    try {
        const { subject, message } = req.body;

        if (
            typeof subject !== 'string' ||
            typeof message !== 'string' ||
            !subject.trim() ||
            !message.trim() ||
            subject.length > 200 ||
            message.length > 5000
        ) {
            return res.status(400).json({
                message: 'Invalid message'
            });
        }

        const contact = await ContactMessage.create({
            owner: req.user._id,
            name: req.user.username,
            email: req.user.email,
            subject: subject.trim(),
            message: message.trim()
        });

        res.status(201).json(contact);
    } catch (err) {
        next(err);
    }
});

// Get my messages
router.get('/messages', async (req, res, next) => {
    try {
        const messages = await ContactMessage.find({
            owner: req.user._id
        }).sort({ createdAt: -1 });

        res.json(messages);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
