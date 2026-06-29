import { Request, Response } from 'express';
import { addCategory, updateCategory } from '../services/category.service.js';
import {
    sendCreatedResult,
    sendSuccessResult,
    sendBadRequestResult,
    sendErrorResult,
    HttpStatusCode
} from '../utils/responseHandler.js';

export const createNewCategory = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;

        if (!name || name.trim() === '') {
            return sendBadRequestResult(res, "Category name is required");
        }

        const newCategory = await addCategory(name);
        return sendCreatedResult(res, newCategory);

    } catch (error: any) {
        console.error("Error creating category:", error);
        return sendErrorResult(res, "Failed to create category", HttpStatusCode.INTERNAL_SERVER_ERROR);
    }
};

export const editExistingCategory = async (req: Request, res: Response) => {
    try {

        const { id } = req.params;
        const { name } = req.body;

        if (!name || name.trim() === '') {
            return sendBadRequestResult(res, "Category name is required for update");
        }

        const updatedCategory = await updateCategory(Number(id), name);
         return sendSuccessResult(res, updatedCategory);

    } catch (error: any) {
        console.error("Error updating category:", error);
        return sendErrorResult(res, "Failed to update category", HttpStatusCode.INTERNAL_SERVER_ERROR);
    }
};