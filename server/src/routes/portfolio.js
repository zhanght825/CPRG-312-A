const express = require('express');
const mongoose = require('mongoose');
const Portfolio = require('../models/Portfolio');
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const { ensureAuthenticated } = require('../middlewares/auth');

const router = express.Router();

// Users can only access their own portfolio data.
router.use(ensureAuthenticated);

function pickFields(body, fields) {
    const data = {};
    for (const field of fields) {
        if (body && Object.prototype.hasOwnProperty.call(body, field)) {
            data[field] = body[field];
        }
    }
    return data;
}

function checkId(req, res, next) {
    if (!mongoose.isObjectIdOrHexString(req.params.id)) {
        return res.status(400).json({ message: 'Invalid ID' });
    }
    next();
}

const profileFields = [
    'name', 'title', 'bio', 'location', 'website', 'github', 'linkedin'
];
const skillFields = ['name', 'category', 'level', 'description', 'order'];
const projectFields = [
    'title', 'description', 'technologies',
    'image', 'github', 'demo', 'featured', 'order'
];

// Get my profile
router.get('/profile', async (req, res, next) => {
    try {
        const profile = await Portfolio.findOne({ owner: req.user._id });
        res.json(profile || {});
    } catch (err) {
        next(err);
    }
});

// Create or update my profile
router.put('/profile', async (req, res, next) => {
    try {
        const data = pickFields(req.body, profileFields);
        const exists = await Portfolio.exists({ owner: req.user._id });
        if (!exists && (typeof data.name !== 'string' || !data.name.trim())) {
            return res.status(400).json({ message: 'Name is required' });
        }

        const profile = await Portfolio.findOneAndUpdate(
            { owner: req.user._id },
            { $set: data, $setOnInsert: { owner: req.user._id } },
            { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
        );
        res.json(profile);
    } catch (err) {
        next(err);
    }
});

// Get my skills
router.get('/skills', async (req, res, next) => {
    try {
        const skills = await Skill.find({ owner: req.user._id })
            .sort({ order: 1, name: 1 });
        res.json(skills);
    } catch (err) {
        next(err);
    }
});

// Create my skill
router.post('/skills', async (req, res, next) => {
    try {
        const skill = await Skill.create({
            ...pickFields(req.body, skillFields),
            owner: req.user._id
        });
        res.status(201).json(skill);
    } catch (err) {
        next(err);
    }
});

// Update my skill
router.put('/skills/:id', checkId, async (req, res, next) => {
    try {
        const skill = await Skill.findOneAndUpdate(
            { _id: req.params.id, owner: req.user._id },
            { $set: pickFields(req.body, skillFields) },
            { new: true, runValidators: true }
        );
        if (!skill) return res.status(404).json({ message: 'Skill not found' });
        res.json(skill);
    } catch (err) {
        next(err);
    }
});

// Delete my skill
router.delete('/skills/:id', checkId, async (req, res, next) => {
    try {
        const skill = await Skill.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id
        });
        if (!skill) return res.status(404).json({ message: 'Skill not found' });
        res.json({ message: 'Skill deleted' });
    } catch (err) {
        next(err);
    }
});

// Get my projects
router.get('/projects', async (req, res, next) => {
    try {
        const projects = await Project.find({ owner: req.user._id })
            .sort({ order: 1, createdAt: -1 });
        res.json(projects);
    } catch (err) {
        next(err);
    }
});

// Create my project
router.post('/projects', async (req, res, next) => {
    try {
        const project = await Project.create({
            ...pickFields(req.body, projectFields),
            owner: req.user._id
        });
        res.status(201).json(project);
    } catch (err) {
        next(err);
    }
});

// Update my project
router.put('/projects/:id', checkId, async (req, res, next) => {
    try {
        const project = await Project.findOneAndUpdate(
            { _id: req.params.id, owner: req.user._id },
            { $set: pickFields(req.body, projectFields) },
            { new: true, runValidators: true }
        );
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json(project);
    } catch (err) {
        next(err);
    }
});

// Delete my project
router.delete('/projects/:id', checkId, async (req, res, next) => {
    try {
        const project = await Project.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id
        });
        if (!project) return res.status(404).json({ message: 'Project not found' });
        res.json({ message: 'Project deleted' });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
