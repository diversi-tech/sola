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