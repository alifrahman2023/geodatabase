import { generateResult } from "./gemini";
import { scrapeWebsite } from "./scraper";

export const scrapeAndGenerate = async (url: string): Promise<string> => {
  try {
    const rawText = await scrapeWebsite(url);
    console.log(rawText);
    const prompt = `Extract the following information:\n- City Name: 
            \n- County:\n- Population:\n- Climate Change:\n- Economic Conditions:
            \n- Climate Change Challenges:\n- Mitigation Strategies: \n from this
            text \n ${rawText}`;

    const result = await generateResult(prompt);
    return result;
  } catch (e) {
    console.error("Error scraping and generating", e);
    throw new Error("Failed to scrape and generate");
  }
};
