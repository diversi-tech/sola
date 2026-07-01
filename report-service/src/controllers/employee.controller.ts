import { Request, Response } from 'express';
import { addEmployee, updateEmployee } from '../services/employee.service.js';
import {
    sendCreatedResult,
    sendSuccessResult,
    sendBadRequestResult,
    sendErrorResult,
    HttpStatusCode
} from '../utils/responseHandler.js';

export const createNewEmployee = async (req: Request, res: Response) => {
    try {
        const { name, Email, phoneNumber } = req.body;


        if (!name || name.trim() === '') {
            return sendBadRequestResult(res, "Employee name is required");
        }

        const employeeData = {
            name: name.trim(),
            Email: Email ? Email.trim() : null,
            "Phone number": phoneNumber ? phoneNumber.trim() : null
        };

        const newEmployee = await addEmployee(employeeData);
        return sendCreatedResult(res, newEmployee);

    } catch (error: any) {
        console.error("Error creating employee:", error);
        return sendErrorResult(res, "Failed to create employee", HttpStatusCode.INTERNAL_SERVER_ERROR);
    }
};


export const editExistingEmployee = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, Email, phoneNumber } = req.body;


        if (name !== undefined && name.trim() === '') {
            return sendBadRequestResult(res, "Employee name cannot be empty");
        }

        const updateData: any = {};
        if (name !== undefined) updateData.name = name.trim();
        if (Email !== undefined) updateData.Email = Email ? Email.trim() : null;
        if (phoneNumber !== undefined) updateData["Phone number"] = phoneNumber ? phoneNumber.trim() : null;

        const updatedEmployee = await updateEmployee(Number(id), updateData);
        return sendSuccessResult(res, updatedEmployee);

    } catch (error: any) {
        console.error("Error updating employee:", error);
        return sendErrorResult(res, "Failed to update employee", HttpStatusCode.INTERNAL_SERVER_ERROR);
    }
};