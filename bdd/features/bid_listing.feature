@not_implemented
Feature: The bid listing interface - listing and navigation
  As I user with the appropriate permissions as regards bids
  I want to be able to list the pending bids
  This will help me to see bids that I have not requested and bids that I have requested
  So I can make a decision about whether to make a new request or mark bid as requested

  Scenario Outline: Visit form M list page
  """
    20 is pagination_size for bids.
    Num links = ceil(num_bids / 20) + 2 if num_bids > 20 else 2
    """
    Given there are "<num_bids>" bids in the system
    When I visit the bid listing page
    Then I see "<num_rows>" rows of bids, each displaying few details about each bid
    And "<num_links>" pager links for retrieving the next sets of bids

    Examples:
      | num_bids | num_rows | num_links |
      | 2        | 2        | 2         |
      | 20       | 20       | 2         |
      | 21       | 20       | 4         |
      | 41       | 20       | 5         |
