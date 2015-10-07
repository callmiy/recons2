from behave import *
from selenium.common.exceptions import StaleElementReferenceException
from letter_of_credit.factories import FormMFactory, LcBidRequestFactory
import nose.tools as nt
import time
from letter_of_credit.models import LcBidRequest


@step("there are bids in the system which had been downloaded previously")
def step_impl(context):
    """
    :type context behave.runner.Context
    """
    context.bid_ids = [LcBidRequestFactory(mf=FormMFactory(), downloaded=True).id for x in range(2)]


@step("select some bids to mark as requested while leaving some unselected as control")
def step_impl(context):
    """
    :type context behave.runner.Context
    """
    context.browser.check('bid-item-%d' % context.bid_ids[0])


@then("the background colour of selected bid rows will change to color rgb'242, 243, 210' - indicating selection")
def step_impl(context):
    """
    :type context behave.runner.Context
    """
    row_1 = context.browser.driver.find_element_by_id('bid-table-row-%d' % context.bid_ids[0])
    nt.assert_in('(242, 243, 210', row_1.value_of_css_property('background-color'))

    context.selected_row = row_1


@then("the background colour of unselected bid rows will not change to color rgb'242, 243, 210'")
def step_impl(context):
    row_2 = context.browser.driver.find_element_by_id('bid-table-row-%d' % context.bid_ids[1])
    nt.assert_not_in('(242, 243, 210', row_2.value_of_css_property('background-color'))

    context.unselected_row = row_2


@step("the 'Mark as requested' button that was disabled is now enabled")
def step_impl(context):
    """
    :type context behave.runner.Context
    """
    mark_requested_btn_web_element = context.browser.driver.find_element_by_name('bid-home-mark-as-requested-btn')
    context.mark_requested_btn_web_element = mark_requested_btn_web_element

    nt.assert_false(mark_requested_btn_web_element.get_attribute('disabled'),
                    "'bid-home-mark-as-requested-btn' button must be enabled after we have check at least one "
                    "downloaded bid")


@when("I click the 'Mark as requested' button")
def step_impl(context):
    """
    :type context behave.runner.Context
    """
    context.mark_requested_btn_web_element.click()


@then("the selected bids will be marked as 'requested' in the system")
def step_impl(context):
    """
    :type context behave.runner.Context
    """
    # wait for the bid to have been updated in the system
    time.sleep(1)
    nt.assert_is_not_none(LcBidRequest.objects.get(pk=context.bid_ids[0]).requested_at,
                          "When a bid is checked and 'mark as requested button clicked, the bid 'requested_at' "
                          "attribute should not be 'None'")


@step("will no longer be visible in the bid listing interface")
def step_impl(context):
    """
    :type context behave.runner.Context
    """
    with nt.assert_raises(StaleElementReferenceException):
        context.selected_row.is_displayed()  # "The bid marked as requested should be removed from the interface"


@step("the unselected bids will not be marked as 'requested' in the system")
def step_impl(context):
    """
    :type context behave.runner.Context
    """
    nt.assert_is_none(LcBidRequest.objects.get(pk=context.bid_ids[1]).requested_at,
                      "When a bid is not checked when 'mark as requested button clicked, the bid 'requested_at' "
                      "attribute should remain as 'None'")


@step("will still be be visible in the bid listing interface")
def step_impl(context):
    """
    :type context behave.runner.Context
    """
    nt.assert_true(context.unselected_row.is_displayed(),
                   "Un-selected bids should still be be visible in the bid listing interface")


@step("the 'Mark as requested' button is now disabled")
def step_impl(context):
    """
    :type context behave.runner.Context
    """
    nt.assert_true(context.mark_requested_btn_web_element.get_attribute('disabled'),
                   "'bid-home-mark-as-requested-btn' button must be disabled after bids have been marked as 'requested")
