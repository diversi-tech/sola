import passport from 'passport';
import { getEmployeeById } from '../../services/oidc.service.js';
import { Employee } from '../../types/user.js'; 

import './google.strategy.js';
import './facebook.strategy.js';

passport.serializeUser((user: Express.User, done) => {
  const userData = user as Employee; 
  done(null, userData.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const employee = await getEmployeeById(id); 
    done(null, employee); 
  } catch (error) {
    done(error, null);
  }
});

export default passport;