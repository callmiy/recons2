Feature: Add a form M
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
