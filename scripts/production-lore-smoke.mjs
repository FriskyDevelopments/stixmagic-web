import { chromium } from '@playwright/test';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const apiResponses = [];
const consoleErrors = [];

page.on('response', (response) => {
  if (response.url().includes('/lore/')) apiResponses.push({ url: response.url(), status: response.status() });
});
page.on('console', (message) => {
  if (message.type() === 'error') consoleErrors.push(message.text());
});

await page.goto('https://stixmagic.com/lore/archive/', { waitUntil: 'networkidle' });
const result = {
  url: page.url(),
  title: await page.title(),
  archive: await page.getByText('ENTER THE ARCHIVE').isVisible(),
  auraMap: await page.getByRole('heading', { name: /Four weather systems/i }).isVisible(),
  decisions: await page.getByText('DECISION 01 / 06').isVisible(),
  apiResponses,
  consoleErrors: consoleErrors.slice(0, 10)
};
console.log(JSON.stringify(result, null, 2));
await browser.close();
