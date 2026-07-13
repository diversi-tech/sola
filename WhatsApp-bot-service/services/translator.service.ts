import translate from 'google-translate-api-x';


export async function translateForUser(text: string, targetLang: string | undefined): Promise<string> {
 
  if (!targetLang || targetLang.toLowerCase() === 'en') {
    return text;
  }

  try {
    const response = await translate(text, { to: targetLang });
    return response.text;
  } catch (error) {
    console.error("Translation service error:", error);
   
    return text; 
  }
}