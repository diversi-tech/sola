export const connectWithGoogle = () => {
  window.location.href = `${import.meta.env.VITE_AUTH_SERVICE_URL}/api/auth/google`;
};