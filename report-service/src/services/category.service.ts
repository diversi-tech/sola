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

export const addCategory = async (name: string) => {
    const { data, error } = await supabase
        .from('ReportCategory')
        .insert([{ name: name }])
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const updateCategory = async (id: number | string, newName: string) => {
    const { data, error } = await supabase
        .from('ReportCategory')
        .update({ name: newName })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
};


export const getAllCategories = async () => {
    const { data, error } = await supabase
        .from('ReportCategory')
        .select('*');

    if (error) throw error;
    return data;
};