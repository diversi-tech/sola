import { Request, Response, NextFunction } from 'express';
import * as localAuthService from '../services/localAuth.service.js';

export const createEmployeeByAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, name, phoneNumber, permissionIds } = req.body;

        if (!email || !name) {
            res.status(400).json({ message: "Required fields are missing: Email and Name are required." });
            return;
        }

        const newEmployee = await localAuthService.inviteEmployee(email, name, phoneNumber, permissionIds);

        res.status(201).json({ 
            message: "The employee was created successfully and an invitation was sent to their email!", 
            employee: newEmployee 
        });
    } catch (error) {
        next(error);
    }
};

export const loginToDashboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: "Please enter an email and password." });
            return;
        }

        const loginData = await localAuthService.authenticateUser(email, password);

        res.status(200).json({
            message: "You have successfully logged in to the dashboard.",
            ...loginData
        });
    } catch (error) {
        next(error);
    }
};

export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authId = res.locals.user.id;
        const permissions = await localAuthService.getEmployeePermissions(authId);
        res.status(200).json({ permissions });
    } catch (error) {
        next(error);
    }
};

export const requestPasswordReset = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email } = req.body;

        if (!email) {
            res.status(400).json({ message: "Please provide an email address." });
            return;
        }

        await localAuthService.sendPasswordReset(email);

        res.status(200).json({ 
            message: "If this email is registered in our system, a password reset link has been sent." 
        });
    } catch (error) {
        next(error);
    }
};

export const setNewPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { newPassword, accessToken } = req.body;

        if (!newPassword || newPassword.length < 6) {
            res.status(400).json({ message: "Please enter a password with at least 6 characters." });
            return;
        }

        if (!accessToken) {
            res.status(400).json({ message: "Missing password reset token." });
            return;
        }

        const user = await localAuthService.updatePassword(accessToken, newPassword);

        res.status(200).json({ 
            message: "The password has been updated successfully! You can now log in with it.",
            user 
        });
    } catch (error) {
        next(error);
    }
};

export const addNewPermission = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authId = res.locals.user.id;
        const { name, description } = req.body;
        
        if (!name || !description) {
            res.status(400).json({ message: "Please provide both 'name' and 'description' for the new permission." });
            return;
        }

        const permission = await localAuthService.createNewPermission(authId, name, description);

        res.status(201).json({ 
            message: "Permission created successfully!", 
            permission 
        });
    } catch (error) {
        next(error);
    }
};