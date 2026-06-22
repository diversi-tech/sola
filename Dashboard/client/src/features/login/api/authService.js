
const API_BASE_URL = 'http://localhost:5000'; 

export const connectWithGoogle = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/connect-with-google`, {
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