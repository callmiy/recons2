from behave import *
from adhocmodels.factories import CustomerFactory, CurrencyFactory
import nose.tools as nt
from letter_of_credit.factories import LCIssueFactory
from letter_of_credit.models import LcBidRequest, LCIssue
import time


def add_form_m_btn_is_disabled(context):
    return context.browser.driver.find_element_by_name(context.submit_btn_name).get_attribute('disabled')


@given("There is new form M request with form M data")
def step_impl(context):
    """
    :type context behave.runner.Context
    """
    form_m_data = dict(
        number='MF20159999990',
        amount=410252
    )
    context.form_m_data = form_m_data


@given("There is customer in the system")
def step_impl(context):
    """
    :type context behave.runner.Context
    """
    context.applicant = CustomerFactory(name='ACADEMIC PRESS LTD')


@when("I complete the 'add form M' form with basic information")
def step_impl(context):
    """
    :type context behave.runner.Context
    """
    browser = context.browser

    if browser.is_element_present_by_name('addFormMForm', wait_time=4):
        # currency and applicant are selected via drop-downs. This is the selector for the drop-down
        type_ahead_css_selector = 'li[id^=typeahead-][id*=-option-]'

        submit_btn_name = 'formMAddSubmitBtn'
        context.submit_btn_name = submit_btn_name

        # the submit button is disabled until form is completely filled and valid
        nt.assert_true(add_form_m_btn_is_disabled(context), 'Submit button must be disabled when the form is empty')

        form_m_data = context.form_m_data
        form_m_number = form_m_data['number']

        browser.fill('form-m-number', form_m_number)

        browser.fill('applicant', context.applicant.name[:-1])  # otherwise typeahead dropdown will not show
        if browser.is_element_present_by_css(type_ahead_css_selector, wait_time=5):
            browser.find_by_css(type_ahead_css_selector).first.click()

        browser.fill('currency', context.currency.code[:-1])  # otherwise typeahead dropdown will not show
        if browser.is_element_present_by_css(type_ahead_css_selector, wait_time=5):
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
        context.browser.is_element_present_by_css('.confirmation-dialog.ui-dialog-content', wait_time=4),
        'Form M has been created and confirmation dialog must now be shown.')

    nt.assert_true(
        context.browser.is_text_present('"%s" successfully saved' % context.form_m_data['number']),
        'Form M has been created and "success message must now be displayed in confirmation dialog title"')
    time.sleep(2)


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

    # I found this is the least time I had to wait before bid appears in the system. Apparently this is caused by the
    # fact that I have two http requests - one to save the form M and another to save the bid. May be I can make this
    # more efficient by posting to a URL which can save both form M and bid simultaneously.
    # :TODO implement such a feature where I can both create form M and bid via a single http request
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
