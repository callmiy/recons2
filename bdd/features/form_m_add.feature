Feature: Add a form M
  As a user
  I want to store information about form M in the database
  So I should be able to use the form M interface for this purpose

  Background: I must be a logged in user
    Given I am logged in
    And I am at form M list page

  Scenario: Fill a form M - basic information only
    Given There is new form M with form M data
    When I complete the 'add form M' form with basic information
    And submit the completed form
    Then I see a row of the newly completed form M

  Scenario: Fill a form M - with bid data
    Given There is new form M with form M data
    When I complete the 'add form M' form with basic information
    And complete bid request form
    And submit the completed form
    Then I see a row of the newly completed form M
    And confirm there is a new bid request in the system
