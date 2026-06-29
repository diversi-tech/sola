import passport from 'passport';
import AppleStrategy from 'passport-apple';
import { findOrCreateOauthUser } from '../../services/oidc.service.js';

passport.use(
  new AppleStrategy(
    {
      clientID: process.env.APPLE_CLIENT_ID || '', 
      teamID: process.env.APPLE_TEAM_ID || '',
      keyID: process.env.APPLE_KEY_ID || '',
      privateKeyLocation: process.env.APPLE_PRIVATE_KEY_PATH || '',
      callbackURL: process.env.APPLE_CALLBACK_URL || 'http://localhost:3000/api/auth/apple/callback',
      passReqToCallback: true
    },
    async (req, accessToken, refreshToken, idToken, profile, done) => {
      try {
        const email = profile.email || (req.body && req.body.user ? JSON.parse(req.body.user).email : null);
        
        if (!email) return done(new Error("No email found from Apple"), undefined);
        
        const user = await findOrCreateOauthUser(email);
        return done(null, user);
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
  )
);