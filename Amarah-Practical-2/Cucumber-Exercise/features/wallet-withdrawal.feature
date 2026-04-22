Feature: Wallet withdrawal validation

  Scenario Outline: Wallet withdrawal validation
    Given the wallet is ready for withdrawal
    When the user attempts to withdraw <amount>
    Then the transaction status should be "<status>"

    Examples:
      | amount | status                       |
      | 200    | SUCCESS                      |
      | 1500   | FAILED                       |
      | 1000   | SUCCESS                      |
      | 6000   | FAILED - Daily Limit Exceeded |
