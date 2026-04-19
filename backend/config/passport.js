import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        
        const email = profile.emails[0].value;
        const photo = profile.photos && profile.photos[0] ? profile.photos[0].value : '';

        if (!user) {
           user = await User.findOne({ email: email });
           
           if(user) {
              user.googleId = profile.id;
              if (!user.photoUrl) user.photoUrl = photo;
              await user.save();
           } else {
              user = await User.create({
                name: profile.displayName,
                email: email,
                googleId: profile.id,
                photoUrl: photo
              });
           }
        }
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

export default passport;
