//GoogleAuth.js
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import User from "../TasksModel/userSchema.js";
dotenv.config();
passport.use(new GoogleStrategy({
    // eslint-disable-next-line no-undef
    clientID: process.env.GOOGLE_CLIENT_ID,
    // eslint-disable-next-line no-undef
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "api/tasks/auth/google/callback"
},
    async function (accessToken, refreshToken, profile, done) {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
            user = await User.findOne({ email: profile.emails[0] })
            if (user) {
                user.googleId = profile.id
            } else {
                user = await User.create({
                    googleId: profile.id,
                    username: profile.displayName,
                    email: profile.emails[0]
                })
            }
            console.log("google verified", user)
            return done(null, user)
        }
    }))

passport.serializeUser((user, done) => {
  done(null, user.id); // store user ID in session
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user); // attach user to req.user
});

export default passport;