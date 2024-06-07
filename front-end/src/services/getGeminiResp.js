import axios from 'axios';

const GetGeminiResp = async (userPrompt) => {
  try {
    const response = await axios.get('http://127.0.0.1:5000/gemini_resp', {
      params: { value: userPrompt }
    });
    return response.data.result;
  } catch (error) {
    console.error('Error fetching data from backend:', error);
    return null;
  }
};

export default GetGeminiResp;
