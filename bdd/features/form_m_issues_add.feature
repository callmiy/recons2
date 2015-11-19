@form_m_detail_interface
@form_m_issues_interface
Feature: Store and manage form M issues
  As a user with the necessary privileges
  I should be able to store form M issues in the database
  I should be able to do this with the form M issues interface

  Background: I must be a logged in user
    Given There is new form M request with form M data
    And There is currency in the system
    And I am logged in
    And I am at form M page

  @fill_form_m_issues_basic
  Scenario: Register form M issues (basic)
    Given There is customer in the system
    And there are LC issues in the system
    And I notice the text 'Add Letter Of Credit Issues' with a down pointing arrow before the text
    When I click any where in the box that contains the text 'Add Letter Of Credit Issues'
    Then I notice that there is no form control for entering/selecting issues
    When I fill form M number field
    Then I notice that save button is disabled
    When I fill applicant field
    Then I see a drop down containing the text I typed into the input field
    When I click the first item in the drop down
    When I fill currency field
    When I fill amount field
    Then I notice that save button is enabled
    When I click any where in the box that contains the text 'Add Letter Of Credit Issues'
    Then I notice that the text 'Add Letter Of Credit Issues' has changed to 'Dismiss' and there is now an upward pointing arrow
    And There is now a form input with label that says 'Type LC issue'
    Then I notice that save button is disabled
    But There is no ui element to show we have specified an issue
    When I type an issue text into the issue form control
    Then I notice a ui element showing the issue I just selected
    Then I notice that save button is enabled
    When I submit the completed form
    Then I notice that dialog contains information about saved form M
    And Dialog contains information about selected issues
    And confirm that there is an issue attached to form M in the system
