import { promises } from "dns";
import { supabase } from "../config/supabase.js";

export const isUserAuthorized = async (phoneNumber: string): Promise<boolean> => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('ID')
            .eq('PhoneNumber', phoneNumber)
        if (error) {
            console.error('Supabase query error:', error.message);
            throw new Error('Database query failed');
        }
        const isAuthorized = data != null && data.length > 0;
        return isAuthorized;
    }
    catch (error) {
        console.error('Service error in isUserAuthorized:', error);
        throw error;
    }
}

