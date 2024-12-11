const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateResult = async (prompt: string): Promise<string> => {
  try {
    const result = await model.generateContent(prompt);
    return result;
  } catch (e) {
    console.error("Error fetching data from Gemini", e);
    throw new Error("Failed to fetch data from Gemini");
  }
};
