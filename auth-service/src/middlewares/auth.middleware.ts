import { Request, Response, NextFunction } from 'express';
import { supabase, supabaseAdmin } from '../config/supabase.js';

export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: "Access Denied: No token provided." });
            return;
        }

        const token = authHeader.split(' ')[1];

        const { data, error } = await supabase.auth.getUser(token);

        if (error || !data.user) {
            res.status(401).json({ message: "Invalid or expired token. Please log in again." });
            return;
        }
        res.locals.user = data.user;

        next();

    } catch (error) {
        next(error);
    }
};

// Must run after requireAuth — it relies on res.locals.user being set.
export const requirePermission = (...requiredPermissions: string[]) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const authId = res.locals.user?.id;
            if (!authId) {
                res.status(401).json({ message: "Access Denied: No authenticated user." });
                return;
            }

            const { data: employee, error } = await supabaseAdmin
                .from('Employees')
                .select(`id, employee_permissions ( permissions ( name ) )`)
                .eq('auth_id', authId)
                .single();

            if (error || !employee) {
                res.status(403).json({ message: "Access Denied: Employee record not found." });
                return;
            }

            const userPermissions = (employee.employee_permissions as any[]).map(ep => ep.permissions.name);
            const hasPermission = requiredPermissions.some(p => userPermissions.includes(p));

            if (!hasPermission) {
                res.status(403).json({ message: "Access Denied: You do not have permission to perform this action." });
                return;
            }

            next();

        } catch (error) {
            next(error);
        }
    };
};