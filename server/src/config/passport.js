
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    state: true
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({
            googleId: profile.id
        });

        if (!user) {
            const email = profile.emails?.[0]?.value?.toLowerCase();

            if (!email || profile._json?.email_verified === false) {
                return done(null, false);
            }

            // Do not automatically link an existing local account
            const existingUser = await User.findOne({ email });

            if (existingUser) {
                return done(null, false);
            }

            user = new User({
                googleId: profile.id,
                username: `google_${profile.id}`,
                email,
                role: 'user'
            });

            await user.save();
        }

        return done(null, user);

    } catch (err) {
        if (err.code === 11000) {
            return done(null, false);
        }

        return done(err);
    }
}));

module.exports = passport;
