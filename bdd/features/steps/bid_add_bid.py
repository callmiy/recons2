from behave import *
import nose.tools as nt
from selenium.webdriver import ActionChains
from splinter.exceptions import ElementDoesNotExist
import time


@step("I visit the add bid interface")
def step_impl(context):
    """
    :type context behave.runner.Context
    """
    context.browser.visit(context.config.server_url + '/letter-of-credit/app/home#/bid/add-bid')


@then("I see that the form M field is not editable")
def step_impl(context):
    """
    :type context behave.runner.Context
    """
    nt.assert_true(context.browser.driver.find_element_by_name('mf').get_attribute('readonly'),
                   "The 'form M' field must not be editable")


@step("goods description field is not editable")
def step_impl(context):
    """
    :type context behave.runner.Context
    """
    nt.assert_true(context.browser.driver.find_element_by_name('goods-description').get_attribute('readonly'),
                   "The 'goods-description' field must not be editable")


@step("'make request' - submit button is disabled")
def step_impl(context):
    """
    :type context behave.runner.Context
    """
    nt.assert_true(context.browser.driver.find_element_by_name('add-bid-form-control-submit').get_attribute('disabled'),
                   "The 'submit' button must be disabled")


@when("I visit the add bid interface for first time, 'search form M' form is not visible")
def step_impl(context):
    """
    :type context behave.runner.Context
    """
    with nt.assert_raises(ElementDoesNotExist):
        form = context.browser.find_by_name('searchFormMModalForm')
        form = form[0]


@when("I double click on form M field")
def step_impl(context):
    """
    :type context behave.runner.Context
    """
    action_chains = ActionChains(context.browser.driver)
    action_chains.double_click(context.browser.driver.find_element_by_name('mf')).perform()
