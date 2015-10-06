from behave import *
from letter_of_credit.factories import FormMFactory, LcBidRequestFactory
import time


@step("there are bids in the system which had been downloaded previously")
def step_impl(context):
    """
    :type context behave.runner.Context
    """
    context.bids = [LcBidRequestFactory(mf=FormMFactory(), downloaded=True) for x in range(2)]


@step("select bids I want to mark as requested")
def step_impl(context):
    """
    :type context behave.runner.Context
    """
    browser = context.browser
    [browser.check('bid-item-%d' % bid.id) for bid in context.bids]


@then("the background colour of each row will change to color #F2F3D2 - indicating selection")
def step_impl(context):
    """
    :type context behave.runner.Context
    """
    pass


@step("the 'Mark as requested' button that was disabled is now enabled")
def step_impl(context):
    """
    :type context behave.runner.Context
    """
    pass


@when("I click the 'Mark as requested' button")
def step_impl(context):
    """
    :type context behave.runner.Context
    """
    pass


@then("the selected bids will be marked as 'requested' in the system")
def step_impl(context):
    """
    :type context behave.runner.Context
    """
    pass


@step("will no longer be visible in the bid listing interface")
def step_impl(context):
    """
    :type context behave.runner.Context
    """
    pass
