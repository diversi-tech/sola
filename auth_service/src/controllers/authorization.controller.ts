import { Request, Response } from 'express';
import { isUserAuthorized } from '../services/authorization.service.js';
export const verifyPhoneHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const phoneNumber = req.body.phoneNumber;
        if (!phoneNumber) {
            res.status(400).json({
                isSuccess: false,
                statusCode: 400,
                message: 'Phone number is required'
            });
            return;
        }
        if (!phoneNumber.startsWith('+')) {
            res.status(400).json({ 
                isSuccess: false,
                statusCode: 400,
                message: "Phone number must start with '+' and country code"
            });
            return;
        }
        const isAuthorized = await isUserAuthorized(phoneNumber);
        if (isAuthorized) {
            res.status(200).json({
                isSuccess: true,
                statusCode: 200,
                message: 'User is authorized'
            });
        } else {
            res.status(401).json({
                isSuccess: false,
                statusCode: 401,
                message: 'User is not authorized'
            });
        }
    } catch (error) {
        console.error('Controller error in verifyPhoneHandler:', error);
        res.status(500).json({
            isSuccess: false,
            statusCode: 500,
            message: 'Internal server error'
        });
    }
}