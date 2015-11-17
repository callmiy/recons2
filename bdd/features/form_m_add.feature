@form_m_add
Feature: Add a form M
  As a user
  I want to store information about form M in the database
  So I should be able to use the form M interface for this purpose

  Background: I must be a logged in user
    Given There is new form M request with form M data
    And There is currency in the system
    And I am logged in
    And I am at form M page

  @customer_present
  Scenario: Fill a form M - basic information only (customer already in system)
    Given There is customer in the system
    When I fill form M number field
    Then I notice that save button is disabled
    When I fill applicant field
    Then I see a drop down containing the text I typed into the input field
    When I click the first item in the drop down
    Then I notice that the drop down has disappeared
    Then I notice that save button is disabled
    When I fill currency field
    Then I notice that save button is disabled
    When I fill amount field
    Then I notice that save button is enabled
    When I submit the completed form
    Then I see a dialog that form M was successfully saved
    And confirm that there is one form M in the system

  @no_customer
  Scenario: Fill a form M - basic information only (customer not already in system)
    When I complete form M number field
    And I enter applicant's name in applicant field
    And I click on add new customer image
    Then A dialog pops up for adding new customer
    And I see applicant's name in the dialog
    And I see that the text and border colour of original input field for applicant is now rgb'169, 68, 66' - indicating form error
    When I click add customer button
    Then I notice that the dialog has disappeared
    And I see that the text and border colour of original input field for applicant is no longer rgb'169, 68, 66' - indicating that input is valid
    When I complete currency and amount fields, and submit the form
    Then I verify that the form M has been properly saved

  @fill_issues
  Scenario: Fill a form M - register LC issues
    Given there are LC issues in the system
    And I notice the text 'Add Letter Of Credit Issues' with a down pointing arrow before the text
    When I click any where in the box that contains the text 'Add Letter Of Credit Issues'
    Then I notice that there is no form control for entering/selecting issues
    When I complete form M with basic information
    Then I notice that save button is enabled
    When I click any where in the box that contains the text 'Add Letter Of Credit Issues'
    Then I notice that the text 'Add Letter Of Credit Issues' has changed to 'Dismiss' and there is now an upward pointing arrow
    And There is now a form input with label that says 'Type LC issue'
    Then I notice that save button is disabled
    But There is no ui element to show we have specified an issue
    When I type an issue text into the issue form control
    Then I notice a ui element showing the issue I just selected
    When I submit the form and verify there is form M in the system
    Then confirm that there is an issue attached to form M in the system
