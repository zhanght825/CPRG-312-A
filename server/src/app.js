require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStoreModule = require('connect-mongo');
const MongoStore = MongoStoreModule.default || MongoStoreModule;
const passport = require('./config/passport');
const csrfProtection = require('./middlewares/csrf');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const portfolioRoutes = require('./routes/portfolio');
const contactRoutes = require('./routes/contact');

const app = express();
const PORT = Number(process.env.PORT || 3002);
const BASE = process.env.APP_BASE_PATH || '/cprg-312';
const prod = process.env.NODE_ENV === 'production';

app.disable('x-powered-by');
app.set('trust proxy', 'loopback');
app.use(helmet());
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());
app.use(session({
    name: 'portfolio.sid',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.DB_CONNECTION,
        dbName: process.env.DB_NAME || 'cprg312_portfolio',
        collectionName: 'sessions'
    }),
    cookie: {
        httpOnly: true,
        secure: prod,
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000,
        path: '/'
    }
}));
app.use(passport.initialize());
app.use('/api', csrfProtection);
app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/contact', contactRoutes);
app.get('/api/health', (req, res) => res.json({
    status: 'OK',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
}));
app.use('/api', (req, res) => res.status(404).json({ message: 'API route not found' }));
app.use((err, req, res, _next) => {
    console.error(err);
    if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid input' });
    }
    if (err.code === 11000) return res.status(409).json({ message: 'Already exists' });
    res.status(500).json({ message: 'Internal server error' });
});

if (require.main === module) {
    if (!process.env.DB_CONNECTION || !process.env.SESSION_SECRET || !process.env.JWT_SECRET) {
        console.error('Missing DB_CONNECTION, SESSION_SECRET or JWT_SECRET');
        process.exit(1);
    }
    mongoose.connect(process.env.DB_CONNECTION, {
        dbName: process.env.DB_NAME || 'cprg312_portfolio'
    }).then(() => {
        console.log('MongoDB connected');
        app.listen(PORT, '127.0.0.1', () => console.log(`API listening on 127.0.0.1:${PORT}`));
    }).catch(error => { console.error('MongoDB connection failed:', error); process.exit(1); });
}
module.exports = app;
