import { Router } from 'express';
import passport from '../config/strategies/google.strategy.js';
import * as authController from '../controllers/oidc.controller.js';
import { requireAuth } from '../middlewares/oidc.middleware.js';

const router = Router();
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), authController.handleGoogleCallback);
router.get('/profile', requireAuth, authController.getProfile);
router.get('/logout', authController.logout);

export default router;

