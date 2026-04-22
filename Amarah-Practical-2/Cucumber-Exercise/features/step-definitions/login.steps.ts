//Feature: Flash Merchant Portal Training Lab

//Scenario: Successful merchant login
//Given I open the Flash Merchant Portal
//When I sign in with username "flash_user" and password "secure123"
//Then I should see login status "SUCCESS - Access Granted. Redirecting to Dashboard..."
//And I should land on the merchant dashboard

//Scenario: Failed merchant login
//Given I open the Flash Merchant Portal
//When I sign in with username "wrong_user" and password "bad_pass"
//Then I should see login status "FAILED - Invalid merchant credentials."

import { Given, When, Then } from '@cucumber/cucumber'
import { expect } from '@playwright/test'

Given('I open the Flash Merchant Portal', async function () {
    await this.page.goto('http://localhost:5173/')
})
When('I sign in with username {string} and password {string}', async function (username: string, password: string) {
    await this.page.getByPlaceholder('flash_user').fill(username)
    await this.page.getByPlaceholder('secure123').fill(password)
    await this.page.getByRole('button', { name: 'Sign In' }).click()
})
Then('I should see login status {string}', async function (message: string) {
    await expect(this.page.getByText(message)).toBeVisible()
})
Then('I should land on the merchant dashboard', async function () {
    await expect(this.page.getByTestId('balance-display')).toBeVisible()
})

