@wip
Feature: Add bid interface
  As a user with the required capabilities
  I should be able to create new bids
  So they can be stored in the system

  Background: Add bid - first thongs
    Given I am logged in
    And I visit the add bid interface

  Scenario: Add bid form
    Then I see that the form M field is not editable
    And goods description field is not editable
    And 'make request' - submit button is disabled

   Scenario: Search form M
     When I visit the add bid interface for first time, 'search form M' form is not visible
     When I double click on form M field

