from behave import *


@when("I visit the add bid interface")
def step_impl(context):
    """
    :type context behave.runner.Context
    """
    context.browser.visit(context.config.server_url + '/letter-of-credit/form-m/home#/bid/add-bid')
