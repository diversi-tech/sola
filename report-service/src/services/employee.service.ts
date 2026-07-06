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

export const addEmployee = async (employeeData: any) => {
    const { data, error } = await supabase
        .from('Employees')
        .insert([
            {
                name: employeeData.name,
                email: employeeData.email,
                phone_number: employeeData.phone_number
            }
        ])
        .select()
        .single();

    if (error) throw error;
    return data;
};


export const updateEmployee = async (id: number, updateData: any) => {
    const { data, error } = await supabase
        .from('Employees')
        .update({
            name: updateData.name,
            email: updateData.email,
            phone_number: updateData.phone_number
        })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
};