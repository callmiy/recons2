@form_m_detail_interface
@form_m_cover_interface
Feature: Add and manage form M cover
  As a user with necessary privileges
  I want to be able to save form M cover data in the system using the form M cover interface of form M detail interface

  Background: I must be a logged in user
    Given There is new form M request with form M data
    And There is currency in the system
    And I am logged in
    And I am at form M page

  Scenario: Fill a form M with cover (basic)
    Given There is customer in the system
    And I notice the text 'Register Cover' with a down pointing arrow before the text
    When I click any where in the box that contains the text 'Register Cover'
    Then I notice that there are no ui elements for entering form M cover details
    When I fill form M number field
    Then I notice that save button is disabled
    When I fill applicant field
    Then I see a drop down containing the text I typed into the input field
    When I click the first item in the drop down
    When I fill currency field
    When I fill amount field
    Then I notice that save button is enabled
    When I click any where in the box that contains the text 'Register Cover'
    Then I notice that the text 'Register Cover' has changed to 'Dismiss' and there is now an upward pointing arrow
    And There is now a form for entering form M cover details
    Then I notice that save button is disabled
    And form M cover form amount field contains the same value as form M amount field
    But form M cover form cover type field has empty selection
    And I notice that save button is disabled
    When I select 'ITF' cover type
    Then I notice that save button is enabled
    And I notice there is nothing on page to indicate that cover was previously booked for this form M
    When I submit the completed form
    Then I notice that dialog contains information about saved form M
    And There is cover attached to the form M in the system
    When I click on dialog close button
    Then I notice there is a table row on page to indicate that cover was booked for this form M
