@form_m_detail_interface
@bid_add_interface
Feature: Add Bid
  As a user with the necessary permissions
  I want to store information about customers' bid requests in the database
  So I should be able to use bid interface to accomplish this

  Background: I must be a logged in user
    Given There is form M request with form M data
    And There is currency in the system
    And I am logged in
    And I am at form M page

  @bid_add_basic
  Scenario: Fill a form M - add bid (basic)
    Given There is customer in the system
    And I notice the text 'New Bid Request' with a down pointing arrow before the text
    When I click any where in the box that contains the text 'New Bid Request'
    Then I notice that there is no bid form visible
    When I fill form M number field
    Then I notice that save button is disabled
    When I fill applicant field
    Then I see a drop down containing the text I typed into the input field
    When I click the first item in the drop down
    When I fill currency field
    When I fill amount field
    Then I notice that save button is enabled
    When I click any where in the box that contains the text 'New Bid Request'
    Then I notice that the text 'New Bid Request' has changed to 'Dismiss' and there is now an upward pointing arrow
    And Bid form is now visible
    And I notice that the bid form amount field contains the same value as form M form amount field
    And bid form goods description field is empty
    And I notice that save button is disabled
    When I fill in goods description
    Then I notice that save button is enabled
    When I submit the completed form
    Then I see a dialog containing information about form M
    And I notice that dialog contains information about saved form M
    And I confirm there is bid in the system attached to the completed form M
    And I see that dialog contains information about saved bid
