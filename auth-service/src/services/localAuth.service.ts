import { supabase, supabaseAdmin } from '../config/supabase.js';
import 'dotenv/config';

const FRONTEND_URL = process.env.FRONTEND_URL;

export const inviteEmployee = async (email: string, name: string, phoneNumber: string, permissionIds: number[]) => {
    
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
        redirectTo: `${FRONTEND_URL}/update-password`
    });
    
    if (authError) {
        throw { statusCode: 400, message: `Error creating and inviting the user: ${authError.message}` };
    }

    const newAuthId = authData.user.id;

    const { data: newEmployee, error: empError } = await supabaseAdmin
        .from('Employees')
        .insert([{ name, email, phone_number: phoneNumber, auth_id: newAuthId }])
        .select()
        .single();

    if (empError) {
        throw { statusCode: 500, message: "Error saving the employee to the database.", error: empError.message };
    }

    if (permissionIds && Array.isArray(permissionIds) && permissionIds.length > 0) {
        const permissionsToInsert = permissionIds.map((permId: number) => ({
            employee_id: newEmployee.id,
            permission_id: permId
        }));

        const { error: permError } = await supabaseAdmin.from('employee_permissions').insert(permissionsToInsert);
        if (permError) {
            throw { statusCode: 500, message: "Error saving employee permissions.", error: permError.message };
        }
    }

    return newEmployee;
};

export const authenticateUser = async (email: string, password: string) => {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
        throw { statusCode: 401, message: "Invalid email or password." };
    }

    const authId = authData.user.id;

    const { data: employee, error: empError } = await supabaseAdmin
        .from('Employees')
        .select(`id, name, employee_permissions ( permissions ( name ) )`)
        .eq('auth_id', authId)
        .single();

    if (empError) {
        throw { statusCode: 404, message: "Error: User exists in the authentication system but is not registered as an employee." };
    }
        if ( !employee) {
        throw { statusCode: 404, message: "Error: User is not exists" };
    }

    const userPermissions = (employee.employee_permissions as any[]).map(ep => ep.permissions.name);

    if (!userPermissions.includes('VIEW_DASHBOARD') && !userPermissions.includes('MANAGE_DASHBOARD')) {
        await supabase.auth.signOut();
        throw { statusCode: 403, message: "You do not have permission to access the dashboard. Access denied." };
    }

    return {
        employeeName: employee.name,
        permissions: userPermissions,
        token: authData.session.access_token
    };
};

export const getEmployeePermissions = async (authId: string): Promise<string[]> => {
    const { data: employee, error } = await supabaseAdmin
        .from('Employees')
        .select(`employee_permissions ( permissions ( name ) )`)
        .eq('auth_id', authId)
        .single();

    if (error || !employee) {
        throw { statusCode: 404, message: "Employee record not found." };
    }

    return (employee.employee_permissions as any[]).map(ep => ep.permissions.name);
};

export const sendPasswordReset = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${FRONTEND_URL}/update-password`,
    });

    if (error) {
        console.error("Supabase Reset Error:", error.message);
        throw { statusCode: 500, message: "Error sending the password reset email." };
    }
};

export const updatePassword = async (accessToken: string, newPassword: string) => {
    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(accessToken);
    if (userError || !userData.user) {
        throw { statusCode: 401, message: "Invalid or expired password reset link. Please request a new one." };
    }

    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userData.user.id, { password: newPassword });
    if (error) {
        throw { statusCode: 400, message: `Error updating the password: ${error.message}` };
    }
    return data.user;
};

export const createNewPermission = async (authId: string, name: string, description: string) => {
    const { data: employee, error: empError } = await supabaseAdmin
        .from('Employees')
        .select('id')
        .eq('auth_id', authId)
        .single();

    if (empError || !employee) {
        throw { statusCode: 404, message: "Employee not found in the database." };
    }

    const { data: checkPermission, error: permError } = await supabaseAdmin
        .from('employee_permissions')
        .select('permission_id')
        .eq('employee_id', employee.id)
        .eq('permission_id', 3);

    if (permError || !checkPermission || checkPermission.length === 0) {
        throw { statusCode: 403, message: "Access Denied: You do not have permission to manage the system permissions." };
    }

    const { data: newPerm, error: insertError } = await supabaseAdmin
        .from('permissions')
        .insert([{ name, description }])
        .select();

    if (insertError) {
        throw { statusCode: 500, message: "Error saving new permission to database.", error: insertError.message };
    }

    return newPerm[0];
};