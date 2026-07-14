/**
 * Returns the Authorization header for the currently logged-in user, or an
 * empty object if there is no stored token. Shared by all API modules so every
 * authenticated request carries the Supabase JWT consistently.
 */
export const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};
