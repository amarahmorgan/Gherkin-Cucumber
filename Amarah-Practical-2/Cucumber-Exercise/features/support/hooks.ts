import { After, Before, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium } from '@playwright/test';
import { CustomWorld } from './world';

const BASE_URL = process.env.BASE_URL ?? 'http://127.0.0.1:5173';

setDefaultTimeout(60 * 1000)

Before(async function (this: CustomWorld) {
  this.browser = await chromium.launch({
    headless: process.env.HEADED !== 'true'
  });
  this.context = await this.browser.newContext({ baseURL: BASE_URL });
  this.page = await this.context.newPage();
});

After(async function (this: CustomWorld) {
  await this.context?.close();
  await this.browser?.close();
});
