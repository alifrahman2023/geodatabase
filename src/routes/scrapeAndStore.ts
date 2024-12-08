import { openai } from "../services/openai";

interface ExtractedData {
  cityName: string;
  county: string;
  population: string;
  climateZone: string;
  economicCondition: string;
  climateChangeChallenges: string;
  mitigationStrategies: string;
}

const extractData = async (rawText: string): string => {
  const prompt = `Extract the following information from the text: \n ${rawText} \n- City Name: \n- County:
    \n- Population:\n- Climate Change:\n- Economic Conditions:\n- Climate Change Challenges:\n- Mitigation Strategies:`;

  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    max_tokens: 300,
    temperature: 0,
  });
};
