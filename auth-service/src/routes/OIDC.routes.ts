import { Router } from 'express';
import passport from 'passport'; 
import * as authController from '../controllers/OIDC.controller.js';
import { requireAuth } from '../middlewares/OIDC.middleware.js';

const router = Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', (req, res, next) => {
    passport.authenticate('google', (err, user, info) => {
      if (err) {
        console.error('OAuth verify error:', err);   // <-- כאן תראי את שגיאת ה-DB האמיתית
        return res.status(500).json({ message: err.message });
      }
      if (!user) {
        console.warn('OAuth no user:', info);
        return res.redirect('/login');
      }
      req.logIn(user, (loginErr) => {
        if (loginErr) { return next(loginErr); }
        return authController.handleOauthCallback(req, res, next);
      });
    })(req, res, next);
  });




router.get('/profile', requireAuth, authController.getProfile);
router.get('/logout', authController.logout);

export default router;

