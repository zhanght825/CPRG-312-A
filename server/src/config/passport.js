const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_CALLBACK_URL) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
        state: true
    }, async (_accessToken, _refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ googleId: profile.id });
            if (!user) {
                const email = profile.emails?.[0]?.value?.trim().toLowerCase();
                if (!email || profile._json?.email_verified !== true) return done(null, false);
                // An existing local account must not be linked without explicit user verification.
                if (await User.exists({ email })) return done(null, false);
                user = await User.create({
                    username: `google_${profile.id}`,
                    email, googleId: profile.id, role: 'user'
                });
            }
            done(null, user);
        } catch (err) { done(err); }
    }));
}
module.exports = passport;
