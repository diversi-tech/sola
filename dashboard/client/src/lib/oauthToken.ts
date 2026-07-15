// Runs once at startup, before the router/route-guards read localStorage.
// The Google OAuth callback redirects back with the Supabase session in the URL
// hash (#access_token=...&type=oauth); we move it into localStorage so the rest
// of the app treats it exactly like an email/password login.
export const captureOAuthTokenFromUrl = (): void => {
  if (!window.location.hash) return;

  const params = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const accessToken = params.get('access_token');

  if (accessToken && params.get('type') === 'oauth') {
    localStorage.setItem('token', accessToken);
    const refreshToken = params.get('refresh_token');
    if (refreshToken) localStorage.setItem('refresh_token', refreshToken);

    // Strip the tokens from the URL so they don't linger in history.
    window.history.replaceState(null, '', window.location.pathname + window.location.search);
  }
};
