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
    And select some bids to mark as requested while leaving some unselected as control
    Then the background colour of selected bid rows will change to color rgb'242, 243, 210' - indicating selection
    And the background colour of unselected bid rows will not change to color rgb'242, 243, 210'
    And the 'Mark as requested' button that was disabled is now enabled
    When I click the 'Mark as requested' button
    Then the selected bids will be marked as 'requested' in the system
    And will no longer be visible in the bid listing interface
    And the unselected bids will not be marked as 'requested' in the system
    And will still be be visible in the bid listing interface
