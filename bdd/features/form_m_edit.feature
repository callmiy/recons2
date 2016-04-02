@form_m_detail_interface
@form_m_add_interface
@form_m_edit
Feature: Edit form M
  As a user
  I want to change information about form M saved in the database
  So I should be able to use the form M interface for this purpose

  Background: I must be a logged in user
    Given There is form M request with form M data
    And There is currency in the system
    And I am logged in
    And I am at form M page

  @edit_form_m_number
  Scenario: Edit form M - edit form M number
    Given There is customer in the system
    And form M already saved in the system
    But I wish to change the form M number
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
    When I fill field 'Search Form M Number' field with number of form M I wish to work with
    And I click on 'Search Form M' button
    Then I see that dialog with title 'Search Form M' has disappeared
    And that tab title has changed to a text containing information about fetched form M
    Then I see that 'Form M Number' field is now filled with fetched form M number
    And 'Applicant' field is now filled with fetched form M applicant
    And 'Currency' field is now filled with fetched form M currency code
    And 'Amount' field is now filled with fetched form M amount
    And 'Form M Number' field is not editable
    And 'Applicant' field is not editable
    And 'Currency' field is not editable
    And 'Amount' field is not editable
    And 'Date Received' field is not editable
    And 'Form M Number' field has pencil icon
    And 'Applicant' field has pencil icon
    And 'Currency' field has pencil icon
    And 'Amount' field has pencil icon
    And 'Date Received' field has pencil icon
    And I notice that save button is disabled
    When I click on pencil icon of form M number
    Then I see that 'Form M Number' field has eye-open icon
    And I see that 'Form M Number' field is editable
    And I notice that save button is disabled
    When I fill form M number field with form number I want to change to
    Then I notice that save button is enabled
    When I submit the completed form
    Then I see dialog that says form M that I changed to successfully saved
    And I notice that dialog contains information about changed form M number
    And Form M number that I changed to is now in the system
    But Form M number that I changed from is no longer in the system
    And Tab title has changed to a text containing information about form M I changed to

  @edit_form_m_applicant
  Scenario: Edit form M - edit applicant (applicant to change to already in the system)
    Given There is customer in the system
    And form M already saved in the system
    But I wish to change the form M applicant
    Then I notice that save button is disabled
    And that the tab title is 'Form M'
    When I fetch the form M I wish to edit
    When I click on pencil icon of form M applicant
    Then I see that 'Form M applicant' field has eye-open icon
    And I see that 'Form M applicant' field is editable
    And I notice that save button is disabled
    When I fill form M applicant field with applicant I want to change to
    Then I see a drop down containing the text I typed into the input field
    When I click the first item in the drop down
    Then I notice that the drop down has disappeared
    And I notice that save button is enabled
    When I submit the completed form
    Then I see the dialog title informing that form M was successfully saved
    And I notice that dialog contains information about changed form M applicant
    And Form M applicant that I changed to is now in the system
