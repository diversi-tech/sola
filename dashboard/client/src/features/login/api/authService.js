

export const connectWithGoogle = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_AUTH_SERVICE_URL}/api/auth/google`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error("Error in connectWithGoogle:", error);
    throw error; 
  }
};