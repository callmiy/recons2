Feature: List Form Ms Interface
  As a user
  I should be able to see a list of form Ms in the system
  So I can pick anyone to see its details

  Background: User must be logged and currency in system
    Given I am logged in

  Scenario Outline: Visit form M list page
  """
    20 is pagination_size for form M.
    Num links = ceil(num_form_m / 20) + 2 if num_form_m > 20 else 2
    """
    Given there are "<num_form_m>" form Ms in the system
    When I visit form M list page
    Then I see "<num_rows>" rows of form Ms, each displaying few details about each form M
    And "<num_links>" pager links for retrieving the next sets of form Ms

    Examples:
      | num_form_m | num_rows | num_links |
      | 2          | 2        | 2         |
      | 20         | 20       | 2         |
      | 21         | 20       | 4         |
      | 41         | 20       | 5         |
