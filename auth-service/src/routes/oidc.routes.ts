import { Router } from 'express';
import passport from 'passport'; 
import * as authController from '../controllers/oidc.controller.js';
import { requireAuth } from '../middlewares/oidc.middleware.js';

const router = Router();

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), authController.handleGoogleCallback); // תוכלי לשנות את פונקציית הקונטרולר לשם כללי כמו handleOauthCallback

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), authController.handleGoogleCallback);

router.get('/apple', passport.authenticate('apple'));
router.post('/apple/callback', passport.authenticate('apple', { failureRedirect: '/login' }), authController.handleGoogleCallback); // שימי לב שאפל עושים POST לקולבק, לא GET!

router.get('/profile', requireAuth, authController.getProfile);
router.get('/logout', authController.logout);

export default router;