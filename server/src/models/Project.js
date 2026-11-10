
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    technologies: [{
        type: String
    }],
    image: {
        type: String,
        default: ''
    },
    github: {
        type: String,
        default: ''
    },
    demo: {
        type: String,
        default: ''
    },
    featured: {
        type: Boolean,
        default: false
    },
    order: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
