from behave import *

use_step_matcher("re")


@given('there are "(?P<num_bids>.+)" bids in the system')
def step_impl(context, num_bids):
    """
    :type context behave.runner.Context
    :type num_bids str
    """
    pass


@when("I visit the bid listing page")
def step_impl(context):
    """
    :type context behave.runner.Context
    """
    context.browser.visit(context.config.server_url + '/letter-of-credit/form-m/home#/bid')


@then('I see "(?P<num_rows>.+)" rows of bids, each displaying few details about each bid')
def step_impl(context, num_rows):
    """
    :type context behave.runner.Context
    :type num_rows str
    """
    pass


@step('"(?P<num_links>.+)" pager links for retrieving the next sets of bids')
def step_impl(context, num_links):
    """
    :type context behave.runner.Context
    :type num_links str
    """
    pass
