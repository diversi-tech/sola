import { Request, Response, NextFunction } from 'express';
import { supabase, supabaseAdmin } from '../config/supabase.js';

export const createEmployeeByAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, name, phoneNumber, permissionIds } = req.body;

        if (!email || !name) {
            res.status(400).json({ message: "Required fields are missing: Email and Name are required." });
            return;
        }

        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email);

        if (authError) {
            res.status(400).json({ message: `Error creating and inviting the user: ${authError.message}` });
            return;
        }

        const newAuthId = authData.user.id;

        const { data: newEmployee, error: empError } = await supabaseAdmin
            .from('Employees')
            .insert([{ 
                name, 
                email, 
                phone_number: phoneNumber, 
                auth_id: newAuthId 
            }])
            .select()
            .single();

        if (empError) {
            res.status(500).json({ message: "Error saving the employee to the database.", error: empError.message });
            return;
        }

        if (permissionIds && Array.isArray(permissionIds) && permissionIds.length > 0) {
            const permissionsToInsert = permissionIds.map((permId: number) => ({
                employee_id: newEmployee.id,
                permission_id: permId
            }));

            const { error: permError } = await supabaseAdmin
                .from('employee_permissions')
                .insert(permissionsToInsert);

            if (permError) {
                res.status(500).json({ message: "Error saving employee permissions.", error: permError.message });
                return;
            }
        }

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

        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (authError) {
            res.status(401).json({ message: "Invalid email or password." });
            return;
        }

        const authId = authData.user.id;

        const { data: employee, error: empError } = await supabase
            .from('Employees')
            .select(`
                id, name,
                employee_permissions (
                    permissions ( name )
                )
            `)
            .eq('auth_id', authId)
            .single();

        if (empError || !employee) {
            res.status(404).json({ message: "Error: User exists in the authentication system but is not registered as an employee." });
            return;
        }

        const userPermissions = (employee.employee_permissions as any[]).map(ep => ep.permissions.name);

        if (!userPermissions.includes('VIEW_DASHBOARD')) {
            await supabase.auth.signOut(); 
            res.status(403).json({ message: "You do not have permission to access the dashboard. Access denied." });
            return;
        }

        res.status(200).json({
            message: "You have successfully logged in to the dashboard.",
            employeeName: employee.name,
            permissions: userPermissions, 
            token: authData.session.access_token
        });

    } catch (error) {
        next(error);
    }
};



export const setNewPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { newPassword } = req.body;

        if (!newPassword || newPassword.length < 6) {
            res.status(400).json({ message: "Please enter a password with at least 6 characters." });
            return;
        }

        const { data, error } = await supabase.auth.updateUser({
            password: newPassword
        });

        if (error) {
            res.status(400).json({ message: `Error updating the password: ${error.message}` });
            return;
        }

        res.status(200).json({ 
            message: "The password has been updated successfully! You can now log in with it.",
            user: data.user 
        });

    } catch (error) {
        next(error);
    }
};
