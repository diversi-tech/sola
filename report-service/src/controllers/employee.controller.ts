import { supabase } from '../config/supabase.js';

export const findEmployeeByName = async (name: string) => {

    const { data, error } = await supabase
        .from('Employees')
        .select('id')
        .ilike('name', name)
        .single();

    if (error || !data) {
        throw new Error(`Employee named '${name}' was not found in the database.`);
    }

    return data.id;
};

// export const createNewEmployee = async (req: Request, res: Response) => {
//     try {
//         const { name, email, phone_number } = req.body;


//         if (!name || name.trim() === '') {
//             return sendBadRequestResult(res, "Employee name is required");
//         }

//         const employeeData = {
//             name: name.trim(),
//             email: email ? email.trim() : null,
//             phone_number: phone_number ? phone_number.trim() : null
//         };

//         const newEmployee = await addEmployee(employeeData);
//         return sendCreatedResult(res, newEmployee);

//     } catch (error: any) {
//         console.error("Error creating employee:", error);
//         return sendErrorResult(res, "Failed to create employee", HttpStatusCode.INTERNAL_SERVER_ERROR);
//     }
// };


// export const editExistingEmployee = async (req: Request, res: Response) => {
//     try {
//         const { id } = req.params;
//         const { name, email, phone_number } = req.body;


//         if (name !== undefined && name.trim() === '') {
//             return sendBadRequestResult(res, "Employee name cannot be empty");
//         }

//         const updateData: any = {};
//         if (name !== undefined) updateData.name = name.trim();
//         if (email !== undefined) updateData.email = email ? email.trim() : null;
//         if (phone_number !== undefined) updateData.phone_number = phone_number ? phone_number.trim() : null;

//         const updatedEmployee = await updateEmployee(Number(id), updateData);
//         return sendSuccessResult(res, updatedEmployee);

//     } catch (error: any) {
//         console.error("Error updating employee:", error);
//         return sendErrorResult(res, "Failed to update employee", HttpStatusCode.INTERNAL_SERVER_ERROR);
//     }
// };