// Client-side auth state for navigation/UX only. Every protected API is
// enforced server-side, and permissions are checked live via the backend
// (see AdminRoute) — never treat these as a security boundary.

export const isAuthenticated = (): boolean => !!localStorage.getItem('token');
