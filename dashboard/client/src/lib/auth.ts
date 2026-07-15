/**
 * Client-side auth state derived from what the login flow stored in
 * localStorage. NOTE: these checks are for UX/navigation only — every
 * protected API is enforced server-side. Never treat them as a security
 * boundary on their own.
 */

export const isAuthenticated = (): boolean => !!localStorage.getItem('token');

export const getPermissions = (): string[] => {
  try {
    const raw = localStorage.getItem('permissions');
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const hasPermission = (permission: string): boolean =>
  getPermissions().includes(permission);
