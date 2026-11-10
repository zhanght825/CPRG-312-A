
const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        default: 'Other'
    },
    level: {
        type: String,
        default: 'Intermediate'
    },
    description: {
        type: String,
        default: ''
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Skill', skillSchema);
