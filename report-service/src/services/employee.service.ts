import { supabase } from '../config/supabase.js';


export const getAllEmployeeNames = async (): Promise<string[]> => {
    const { data, error } = await supabase
        .from('Employees')
        .select('name');

    if (error || !data) {
        throw new Error("Failed to fetch employees list for AI matching.");
    }

    return data.map(emp => emp.name);
};
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