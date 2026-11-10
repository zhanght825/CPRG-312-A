const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    subject: {
        type: String,
        required: true,
        maxlength: 200
    },
    message: {
        type: String,
        required: true,
        maxlength: 5000
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ContactMessage', contactMessageSchema);
