Feature: Flash Merchant Portal Training Lab

	Scenario: Successful merchant login
		Given I open the Flash Merchant Portal
		When I sign in with username "flash_user" and password "secure123"
		Then I should see login status "SUCCESS - Access Granted. Redirecting to Dashboard..."
		And I should land on the merchant dashboard

	Scenario: Failed merchant login
		Given I open the Flash Merchant Portal
		When I sign in with username "wrong_user" and password "bad_pass"
		Then I should see login status "FAILED - Invalid merchant credentials."