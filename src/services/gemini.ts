import axios from "axios";

const GEMINI_API_BASE_URL = "https://api.gemini.com/v1";
const API_KEY = process.env.GEMINI_API_KEY;

export const getGeminiData = async (
  endpoint: string,
  params: Record<string, any> = {}
) => {
  try {
    const response = await axios.get(`$(GEMINI_API_BASE_URL)/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data from Gemini");
    throw new Error("Failing to fetch data from Gemini");
  }
};
