import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { verifyAndFindOauthEmployee } from '../../services/oidc.service.js';

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID || '',
      clientSecret: process.env.FACEBOOK_APP_SECRET || '',
      callbackURL: process.env.FACEBOOK_CALLBACK_URL || 'http://localhost:5005/api/auth/facebook/callback',
      profileFields: ['id', 'emails', 'name'] 
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        if (!email) return done(new Error("No email found from Facebook"), undefined);
        
        const employee = await verifyAndFindOauthEmployee(email);
        
        if (!employee) {
          return done(null, false, { message: 'Your email is not registered in the system.' });
        }

        return done(null, employee);
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
  )
);