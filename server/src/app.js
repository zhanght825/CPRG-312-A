require('dotenv').config();

const csrfProtection = require('./middlewares/csrf');
const session = require('express-session');
const MongoStoreModule = require('connect-mongo');
const MongoStore = MongoStoreModule.default || MongoStoreModule;
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
const app = express();
const PORT = process.env.PORT || 3002;

app.use(helmet());
app.use(express.json());
app.use(cookieParser());
// Secure session configuration
app.use(session({
    name: 'portfolio.sid',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.DB_CONNECTION,
        dbName: 'cprg312_portfolio',
        collectionName: 'sessions'
    }),
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 15,
        path: '/'
    }
}));
app.use(passport.initialize());
// CSRF protection
app.use('/api', csrfProtection);
app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);
app.set('trust proxy', 1);





mongoose.connect(process.env.DB_CONNECTION, {
    dbName: 'cprg312_portfolio'
})
.then(() => {
    console.log('MongoDB connected successfully');

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
.catch(err => {
    console.error('MongoDB connection error:', err);
});

app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        database: 'MongoDB'
    });
});
