import { Request, Response } from 'express';
import { adminService } from '../services/admin.service.js';

export const adminController = {
  getPermissions: async (req: Request, res: Response) => {
    try {
      const permissions = await adminService.getAllPermissions();
      res.json({ data: permissions });
    } catch (error: any) {
      console.error('Error fetching permissions:', error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  },

  getEmployees: async (req: Request, res: Response) => {
    try {
      const employees = await adminService.getEmployeesWithPermissions();
      res.json({ data: employees });
    } catch (error: any) {
      console.error('Error fetching employees:', error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  },

  updatePermissions: async (req: Request<{ id: string }>, res: Response) => {
    try {
      const employeeId = parseInt(req.params.id, 10);
      const { permissions } = req.body;

      if (isNaN(employeeId) || !Array.isArray(permissions)) {
        return res.status(400).json({ error: 'Invalid input data' });
      }

      await adminService.updateEmployeePermissions(employeeId, permissions);
      res.json({ success: true, message: 'Permissions updated successfully' });
    } catch (error: any) {
      console.error(`Error updating permissions for employee ${req.params.id}:`, error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
  }
};