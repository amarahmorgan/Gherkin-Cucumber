//Feature: Wallet withdrawal validation

//Scenario Outline: Wallet withdrawal validation
//Given the wallet is ready for withdrawal
//When the user attempts to withdraw <amount>
//Then the transaction status should be "<status>"

//Examples:
//  | amount | status                       |
//   | 200    | SUCCESS                      |
//   | 1500   | FAILED                       |
//  | 1000   | SUCCESS                      |
//   | 6000   | FAILED - Daily Limit Exceeded |

import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

Given('the wallet is ready for withdrawal', async function () {
    await this.page.goto('http://localhost:5173/');
    await this.page.getByPlaceholder('flash_user').fill('flash_user')
    await this.page.getByPlaceholder('secure123').fill('secure123')
    await this.page.getByRole('button', { name: 'Sign In' }).click()

    await expect(this.page.getByTestId('login-status')).toContainText('SUCCESS')
    await expect(this.page.getByTestId('balance-display')).toBeVisible()

});

When(
    'the user attempts to withdraw {int}', async function (amount: number) {
        await this.page.getByTestId('withdraw-amount').fill(amount.toString())
        await this.page.getByRole('button', { name: 'Withdraw' }).click()
    });


Then('the transaction status should be {string}', async function (status: string) {
    await expect(this.page.getByTestId('transaction-status')).toHaveText(status);
}
);