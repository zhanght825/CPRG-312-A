
const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    title: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: ''
    },
    location: {
        type: String,
        default: ''
    },
    website: {
        type: String,
        default: ''
    },
    github: {
        type: String,
        default: ''
    },
    linkedin: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Portfolio', portfolioSchema);
