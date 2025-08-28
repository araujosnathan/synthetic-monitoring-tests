import { Page } from '@playwright/test';
import { BasePage } from '../pages/base-page';

export default class AuthorizationService extends BasePage {
    private locators = {
        emailInput: this.page.locator('input[type="email"]'),
        passwordInput: this.page.locator('input[type="password"]'),
        submitButton: this.page.locator('input[type="submit"]')
    };

    constructor(page: Page) {
        super(page);
    }

    async loginViaAAD(username: string, password: string) {
        await this.locators.emailInput.waitFor({ state: 'visible', timeout: 30000 });
        await this.locators.emailInput.fill(username);

        await this.locators.submitButton.click();
        await this.page.waitForTimeout(4000);

        await this.locators.passwordInput.waitFor({ state: 'visible', timeout: 30000 });
        await this.locators.passwordInput.fill(password);

        await this.locators.submitButton.click();

        await this.page.waitForURL(process.env.baseUrl!, { timeout: 30000 });
    }
}
