@form_m_detail_interface
@form_m_attachment_interface
@co
Feature: Form M Attachment
  As a user
  I want to be able to add attachments to form M

  Background: I must be a logged in user
    Given There is form M request with form M data
    And There is currency in the system
    And I am logged in
    And I am at form M page

  @attachment_with_one_file @ex
  Scenario: Create form M attachment with one file - no existing attachments
    Given There is customer in the system
    And form M already saved in the system
    Given There is data about attachment to be saved
    When I fetch the saved form M
    Then I notice a minus-sign icon preceding text 'Add attachment'
    And I notice 'Add attachment' form is visible
    And I notice 'Add attachment' button is disabled
    And I notice there is no indication that any file has been selected
    When I fill attachment title field
    And I choose attachment file
    Then I notice selected file name has appeared in the form
    Then I notice 'Add attachment' button is enabled
    When I click 'Add attachment' button
    Then I notice 'Add attachment' form is not visible

