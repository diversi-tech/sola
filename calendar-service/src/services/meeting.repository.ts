import { supabase } from '../config/supabase.js';
import { Meeting } from '../models/meeting.model.js';

export async function validateUserAndToken(
  user_id: number,
  refreshToken: string
): Promise<{ valid: boolean; error?: string }> {
  const { data: user, error: userError } = await supabase
    .from('Users')
    .select('id, refresh_token')
    .eq('id', user_id)
    .single();

  if (userError || !user) {
    return {
      valid: false,
      error: `User with ID ${user_id} does not exist in the system.`,
    };
  }

  if (user.refresh_token !== refreshToken) {
    return {
      valid: false,
      error: `Provided refresh token does not match the system record for this user.`,
    };
  }

  return { valid: true };
}

export async function saveMeetings(meetings: Meeting[]): Promise<void> {
  if (meetings.length === 0) {
    return;
  }

  const { error: dbError } = await supabase
    .from('Meeting')
    .upsert(meetings, { onConflict: 'google_event_id' });

  if (dbError) {
    throw new Error(`Database error: ${dbError.message}`);
  }
}

export async function getAllActiveUsers(): Promise<
  Array<{ id: number; employee_email: string; refresh_token: string }>
> {
  const { data: users, error } = await supabase
    .from('Users')
    .select('id, employee_email, refresh_token')
    .not('refresh_token', 'is', null);

  if (error) {
    throw new Error(`Failed to fetch users: ${error.message}`);
  }
  
  return users ?? [];
}
