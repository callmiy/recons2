@form_m_add
Feature: Add a form M
  As a user
  I want to store information about form M in the database
  So I should be able to use the form M interface for this purpose

  Background: I must be a logged in user
    Given There is new form M request with form M data
    And There is currency in the system
    And There is customer in the system
    And I am logged in
    And I am at form M page

  Scenario: Fill a form M - basic information only (customer already in system)
    When I complete the 'add form M' form with basic information
    And submit the completed form
    Then I see a row of the newly completed form M

#  Scenario: Fill a form M - with bid data
#    When I complete the 'add form M' form with basic information
#    And complete bid request form
#    And submit the completed form
#    Then I see a row of the newly completed form M
#    And confirm there is a new bid request in the system
#
#  Scenario: Fill a form M - register LC issues
#    Given there are LC issues in the system
#    When I complete the 'add form M' form with basic information
#    And Select the issues with the form M/LC
#    And submit the completed form
#    Then I see a row of the newly completed form M
#    And confirm there are issues in the system
