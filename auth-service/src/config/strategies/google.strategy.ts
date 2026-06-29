import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { findOrCreateGoogleUser } from '../../services/oidc.service.js';
import { getUserById } from '../../services/oidc.service.js';

import { User } from '../../types/user.js'; 

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
    try {
        const user = await findOrCreateGoogleUser(profile);
        return done(null, user);
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
  )
);

passport.serializeUser((user: Express.User, done) => {
  const userData = user as User; 
  done(null, userData.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await getUserById(id); 
    done(null, user); 
  } catch (error) {
    done(error, null);
  }
});

export default passport;