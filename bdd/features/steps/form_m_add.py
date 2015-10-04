from behave import *
from adhocmodels.factories import CustomerFactory, CurrencyFactory
import nose.tools as nt
from letter_of_credit.factories import LCIssueFactory
from letter_of_credit.models import LcBidRequest, LCIssue
import time


def add_form_m_btn_is_disabled(context):
    submit_btn_disabled_script = '$("[name={submit_btn_name}]").prop("disabled")'.format(
        submit_btn_name=context.submit_btn_name)

    return context.browser.evaluate_script(submit_btn_disabled_script)


@given("There is new form M with form M data")
def step_impl(context):
    """
    :type context behave.runner.Context
    """
    form_m_data = dict(
        number='MF20159999990',
        customer_name='ACADEMIC PRESS LTD',
        currency_code='EKM',
        amount=410252
    )

    CustomerFactory(name=form_m_data['customer_name'])
    CurrencyFactory(code=form_m_data['currency_code'])

    context.form_m_data = form_m_data


@step("I am at form M list page")
def step_impl(context):
    """
    :type context behave.runner.Context
    """
    context.browser.visit(context.config.server_url + '/letter-of-credit/form-m/home#/form-m')


@when("I complete the 'add form M' form with basic information")
def step_impl(context):
    """
    :type context behave.runner.Context
    """
    browser = context.browser

    if browser.is_element_present_by_id('add-form-m-form-show-trigger', wait_time=4):
        browser.find_by_id('add-form-m-form-show-trigger').first.click()

    if browser.is_element_present_by_name('addFormMModalForm', wait_time=4):
        # currency and applicant are selected via drop-downs. This is the selector for the drop-down
        type_ahead_css_selector = 'li[id^=typeahead-][id*=-option-]'

        submit_btn_name = 'add-form-m-submit'
        context.submit_btn_name = submit_btn_name

        # the submit button is disabled until form is completely filled and valid
        nt.assert_true(add_form_m_btn_is_disabled(context), 'Submit button must be disabled when the form is empty')

        form_m_data = context.form_m_data
        form_m_number = form_m_data['number']

        form_m_td_xpath = '//td[text()="%s"]' % form_m_number
        context.form_m_td_xpath = form_m_td_xpath  # will be re-used later when form M is submitted

        nt.assert_false(
            browser.is_element_present_by_xpath(form_m_td_xpath),
            'Form M number that is about to be created must not already be listed on the page.')

        browser.fill('form-m-number', form_m_number)

        browser.fill('applicant', form_m_data['customer_name'])
        if browser.is_element_present_by_css(type_ahead_css_selector, wait_time=3):
            browser.find_by_css(type_ahead_css_selector).first.click()

        browser.fill('currency', form_m_data['currency_code'])
        if browser.is_element_present_by_css(type_ahead_css_selector, wait_time=3):
            browser.find_by_css(type_ahead_css_selector).first.click()

        browser.fill('amount', form_m_data['amount'])


@step("submit the completed form")
def step_impl(context):
    """
    :type context behave.runner.Context
    """
    # form is now completely filled and valid - submit button is now enabled
    nt.assert_false(add_form_m_btn_is_disabled(context),
                    'submit button must be enabled when form m is completely filled and valid')
    context.browser.find_by_name(context.submit_btn_name).first.click()


@then("I see a row of the newly completed form M")
def step_impl(context):
    """
    :type context behave.runner.Context
    """
    nt.assert_true(
        context.browser.is_element_present_by_xpath(context.form_m_td_xpath, wait_time=4),
        'Form M number has been created and must now be listed on the page.')


@step("complete bid request form")
def step_impl(context):
    """
    :type context behave.runner.Context
    """
    browser = context.browser

    bid_form = browser.find_by_name('bidRequestForm').first
    nt.assert_false(bid_form.visible, 'The bid request form must be invisible by default')

    browser.find_by_css('.form-m-bid-toggle-show').first.click()

    nt.assert_true(bid_form.visible,
                   'The bid request form must be visible when "toggle bid form" div element is clicked for the first '
                   'time')

    # add form m submit button will now be disabled
    nt.assert_true(add_form_m_btn_is_disabled(context),
                   'submit button must be disabled when bid request is visible and not completely filled')

    browser.fill('goods-description', 'chemical for manufacture of form m goods')


@step("confirm there is a new bid request in the system")
def step_impl(context):
    """
    :type context behave.runner.Context
    """
    form_m_number = context.form_m_data['number']

    time.sleep(1)

    bid_qs = LcBidRequest.objects.filter(mf__number=form_m_number)

    nt.assert_true(bid_qs.exists(), 'Bid with form M number %s must exist in the system' % form_m_number)


@given("there are LC issues in the system")
def step_impl(context):
    """
    :type context behave.runner.Context
    """
    lc_issues_id = []
    [lc_issues_id.append(LCIssueFactory().id) for x in range(2)]
    context.lc_issues_id = lc_issues_id


@step("Select the issues with the form M/LC")
def step_impl(context):
    """
    :type context behave.runner.Context
    """
    browser = context.browser

    lc_issues_container = browser.find_by_css('.form-m-add-lc-issue').first

    nt.assert_false(
        lc_issues_container.visible,
        'The LC issues form container must be invisible by default'
    )

    browser.find_by_css('.form-m-lc-issue-toggle-show').first.click()

    if browser.is_element_present_by_css('.lc-issue-item-checkbox', wait_time=2):
        lc_issues_id = context.lc_issues_id
        [browser.check('lc-issue-item-checkbox-%d' % issue_id) for issue_id in lc_issues_id]


@step("confirm there are issues in the system")
def step_impl(context):
    """
    :type context behave.runner.Context
    """
    count_issues_id = len(context.lc_issues_id)
    nt.assert_equal(LCIssue.objects.all().count(), count_issues_id,
                    'There should be "%d" LC issue IDs in the system' % count_issues_id)
