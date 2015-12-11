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

#  @fill_form_m_uniqueness
#  Scenario: Fill form M - form M number must be unique
#    Given There is customer in the system
#    And form M already saved in the system
#    When I fill 'Form M Number', 'Applicant', 'Currency', and 'Amount' fields and submit form
#    Then I see a dialog with title 'xxx' and which says form M number must be unique

  @edit_form_m_number
  Scenario: Edit form M - number
    Given There is form M with number 'MF01255555555' in the system
    But I wish to edit form M and change number to 'MF01255555556' because I made mistake
    And I see that 'Form M Number' field is empty
    And I see that 'Applicant' field is empty
    And I see that 'Currency' field is empty
    And I see that 'Amount' field is empty
    And I see that 'Date Received' field contains today's date
    And I see that 'Form M Number' field is editable
    And I see that 'Applicant' field is editable
    And I see that 'Currency' field is editable
    And I see that 'Amount' field is editable
    And I see that 'Date Received' field is editable
    And I see that 'Form M Number' field has eye-open icon
    And I see that 'Applicant' field has eye-open icon
    And I see that 'Currency' field has eye-open icon
    And I see that 'Amount' field has eye-open icon
    And I see that 'Date Received' field has eye-open icon
    Then I notice that save button is disabled
    And that the tab title is 'Form M'
    When I double click on the search icon of 'Search Form M' field
    Then I see a dialog with title 'Search Form M'
    When I fill field 'Form M Number' with form M number in the system
    And I click on 'Search Form M' button
    Then I see that dialog with title 'Search Form M' has disappeared
    And that tab title has changed to a text containing information about form M in the system
    And 'Form M Number' field is now filled with form M number
    And 'Applicant' field is now filled with form M applicant
    And 'Currency' field is now filled with form M currency code
    And 'Amount' field is now filled with form M amount
    And Form M form fields are not editable
    And Form M form fields have pencil icons

    And I see that 'Form M Number' field contains form M number in the system
    And I see that 'Applicant' field contains form M applicant in the system
    And I see that 'Currency' field contains form M currency code
    And I see that 'Amount' field contains form M amount in the system
    And I see that 'Form M Number' field is not editable
    And I see that 'Applicant' field is not editable
    And I see that 'Currency' field is not editable
    And I see that 'Amount' field is not editable
    And I see that 'Date Received' field is not editable
    And I see that 'Form M Number' field has pencil icon
    And I see that 'Applicant' field has pencil icon
    And I see that 'Currency' field has pencil icon
    And I see that 'Amount' field has pencil icon
    And I see that 'Date Received' field has pencil icon

