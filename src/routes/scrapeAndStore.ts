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
