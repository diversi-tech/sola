import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { verifyAndFindOauthEmployee } from '../../services/OIDC.service.js';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:3000/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
        if (!email) return done(new Error("No email found from Google"), undefined);

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