import puppeteer from "puppeteer";

export const scrapedWebsite = async (url: string): Promise<string> => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  const data: string = await page.evaluate(() => {
    const rawText = document.body.innerText;
    return rawText;
  });

  await browser.close();
  return data;
};
