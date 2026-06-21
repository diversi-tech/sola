import { supabase } from '../config/supabase.js';

export const getActiveCategories = async (): Promise<string[]> => {
    const { data, error } = await supabase
        .from('ReportCategory')
        .select('name');

    if (error || !data) {
        throw new Error("Failed to fetch categories from database");
    }

    return data.map(c => c.name);
};