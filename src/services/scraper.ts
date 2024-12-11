import puppeteer from "puppeteer";

export const scrapeWebsite = async (url: string): Promise<string> => {
  try {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: false, // some rendering doesn't happen if this is set true (it's needed)
      //slowMo: 50
    });
    const page = await browser.newPage();

    // once you're at the url, wait until it's loaded then proceed
    await page.goto(url, { waitUntil: "networkidle2" });

    const data: string = await page.evaluate(() => {
      const rawText = document.body.innerText;
      console.log(rawText);
      return rawText;
    });

    await browser.close();
    return data;
  } catch (e) {
    console.error("Error parsing the website", e);
    throw new Error("Failed to parse the website");
  }
};
