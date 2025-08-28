import { test, expect, BrowserContext, Page } from '@playwright/test';

const aadUsername: string = process.env['username'] || '';
const aadPassword: string = process.env['password'] || '';
const baseURL: string = process.env['baseUrl'] || '';

let context: BrowserContext;
let page: Page;

test.beforeEach(async ({ browser: bro }) => {
    context = await bro.newContext();
    page = await context.newPage();
    // Init all pages here

    await page.goto(baseURL);
  
}); 

test('User should be able to do somethinng', { tag: ['@some-tag', ] }, async () => {
    // All the test implemention here
    
    //Arrange
    //Act
    //Assert
});

test.afterEach(async () => {
  await page.close();
  await context.close();
});


