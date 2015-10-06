@wip
Feature: The bid listing interface - Mark downloaded bid as 'requested'
  As a user with the appropriate permissions
  If I have downloaded a bid because I wanted to send it to treasury (the request)
  I should be able to mark the bid as 'requested'
  So it does not show up in the list of pending bids
  So I don't send duplicate requests

  Scenario: Mark bid as 'requested'
    Given I am logged in
    And there are bids in the system which had been downloaded previously
    When I visit the bid listing page
    And select bids I want to mark as requested
    Then the background colour of each row will change to color #F2F3D2 - indicating selection
    And the 'Mark as requested' button that was disabled is now enabled
    When I click the 'Mark as requested' button
    Then the selected bids will be marked as 'requested' in the system
    And will no longer be visible in the bid listing interface
