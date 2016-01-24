from behave import *
import nose.tools as nt
from letter_of_credit.factories import LcBidRequestFactory

use_step_matcher("re")


@given('there are "(?P<num_bids>.+)" bids in the system')
def step_impl(context, num_bids):
    """
    :type context behave.runner.Context
    :type num_bids str
    """
    [LcBidRequestFactory() for x in range(int(num_bids))]


@step("I am at bid list tab")
def step_impl(context):
    """
    :type context behave.runner.Context
    """
    context.browser.find_by_css('.bid-list-tab-ctrl>a').first.click()


@then('I see "(?P<num_rows>.+)" rows of bids, each displaying few details about each bid')
def step_impl(context, num_rows):
    """
    :type context behave.runner.Context
    :type num_rows str
    """
    if context.browser.is_element_present_by_css('tbody>tr', wait_time=5):
        table_rows = context.browser.find_by_css('tbody>tr')
        num_rows = int(num_rows)
        actual_rows = len(table_rows)
        nt.assert_equal(actual_rows, num_rows, 'There should be %d rows, but got %s' % (num_rows, actual_rows,))


@step('"(?P<num_links>.+)" pager links for retrieving the next sets of bids')
def step_impl(context, num_links):
    """
    :type context behave.runner.Context
    :type num_links str
    """
    num_links = int(num_links)
    pager_links = context.browser.find_by_css('.pager-nav-link')
    nt.eq_(len(pager_links), num_links, 'There should be %d pager links' % num_links)
