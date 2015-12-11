@form_m_detail_interface
@form_m_add_interface
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
    And that the tab title is 'Form M'
    When I submit the completed form
    Then I see a dialog containing information about form M
    And I see the dialog title informing that form M was successfully saved
    And I notice that dialog contains information about saved form M
    And confirm that there is one form M in the system
    When I click on dialog close button
    Then I see that dialog has disappeared from page
    And that tab title has changed to a text containing information about saved form M

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
    # Multiple steps - from @customer_present
    When I fill currency, amount and submit completed form
    # Multiple steps - from @customer_present
    Then I verify that the form M has been properly saved
