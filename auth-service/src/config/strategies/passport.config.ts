import passport from 'passport';
import { getEmployeeById } from '../../services/oidc-temp.service.js';
import { Employee } from '../../types/employee.js'; 

import './google.strategy.js';

passport.serializeUser((employee: Express.User, done) => {
  const employeeData = employee as Employee; 
  done(null, employeeData.id);
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