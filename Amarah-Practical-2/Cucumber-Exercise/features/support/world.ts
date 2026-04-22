import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import type { Browser, BrowserContext, Page } from '@playwright/test';

declare module '@cucumber/cucumber' {
  interface World {
    browser: Browser;
    context: BrowserContext;
    page: Page;
  }
}

export class CustomWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(CustomWorld);
