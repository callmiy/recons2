from behave import *
from adhocmodels.factories import UserFactory
from letter_of_credit.factories import FormMFactory
from adhocmodels.factories import CurrencyFactory
import nose.tools as nt


@given("There is currency in the system")
def step_impl(context):
    """
    :type context behave.runner.Context
    """
    context.currency = CurrencyFactory(code='XUL')


@given("I am logged in")
def step_impl(context):
    """
    :type context behave.runner.Context
    """
    username = 'lc_test_user'
    UserFactory(username=username)

    context.browser.visit(context.config.server_url + '/accounts/login/')
    context.browser.fill('username', username)
    context.browser.fill('password', 'password')
    context.browser.find_by_css('form input[type=submit]').first.click()


@given('there are "{num_form_m}" form Ms in the system')
def step_impl(context, num_form_m):
    """
    :type context behave.runner.Context
    :type num_form_m str
    """
    [FormMFactory(currency=context.currency) for x in range(int(num_form_m))]


@step("I am at form M page")
def step_impl(context):
    """
    :type context behave.runner.Context
    """
    context.browser.visit(context.config.server_url + '/letter-of-credit/app/home#/form-m')
    # We pre-select and store the tab links so it is easy to visit links
    context.browser.tab_links = context.browser.find_by_css('ul.nav-tabs>li>a')


@step("I am in list form M tab")
def step_impl(context):
    """
    :type context behave.runner.Context
    """
    context.browser.tab_links.first.click()


@then('I see "{num_rows}" rows of form Ms, each displaying few details about each form M')
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


@step('"{num_links}" pager links for retrieving the next sets of form Ms')
def step_impl(context, num_links):
    """
    :type context behave.runner.Context
    :type num_links str
    """
    num_links = int(num_links)
    pager_links = context.browser.find_by_css('.pager-nav-link')
    nt.eq_(len(pager_links), num_links, 'There should be %d pager links' % num_links)
