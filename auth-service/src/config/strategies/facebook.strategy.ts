import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { findOrCreateOauthUser } from '../../services/oidc.service.js';

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID || '',
      clientSecret: process.env.FACEBOOK_APP_SECRET || '',
      callbackURL: process.env.FACEBOOK_CALLBACK_URL || 'http://localhost:3000/api/auth/facebook/callback',
      profileFields: ['id', 'emails', 'name'] 
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        if (!email) return done(new Error("No email found from Facebook"), undefined);
        
        const user = await findOrCreateOauthUser(email);
        return done(null, user);
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
  )
);