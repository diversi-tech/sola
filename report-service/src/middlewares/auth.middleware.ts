import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase.js';

/**
 * Verifies the Supabase JWT sent as a Bearer token. Any request without a
 * valid, unexpired token is rejected before it can reach the data handlers.
 */
export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: 'Access Denied: No token provided.' });
            return;
        }

        const token = authHeader.split(' ')[1];
        const { data, error } = await supabase.auth.getUser(token);

        if (error || !data.user) {
            res.status(401).json({ message: 'Invalid or expired token. Please log in again.' });
            return;
        }

        res.locals.user = data.user;
        next();
    } catch (error) {
        next(error);
    }
};
