import dotenv from "dotenv";
dotenv.config(); // This loads the .env variables into process.env

import express, { Request, Response } from "express";
import { scrapeAndGenerate } from "./services/scrapeAndGenerate";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

app.post("/generate", async (req, res) => {
  // req has to have prompt in the JSON
  const articleLink = req.body.articleLink;
  if (!articleLink) {
    res
      .status(400)
      .json({ error: "Please send an article link in your request" });
    return;
  }

  try {
    const result = await scrapeAndGenerate(articleLink);
    res.json({ result });
  } catch (e) {
    // Check if error is an instance of Error and extract the message
    const errorMessage =
      e instanceof Error ? e.message : "An unknown error occurred";
    res.status(400).json({ error: errorMessage });
  }
});

// set up server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
