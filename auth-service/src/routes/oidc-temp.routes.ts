import { Router } from 'express';
import passport from 'passport'; 
import * as authController from '../controllers/oidc-temp.controller.js';
import { requireAuth } from '../middlewares/oidc-temp.middleware.js';

const router = Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), authController.handleOauthCallback);

router.get('/profile', requireAuth, authController.getProfile);
router.get('/logout', authController.logout);

export default router;

