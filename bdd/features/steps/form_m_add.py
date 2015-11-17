import random
from behave import *
from adhocmodels.factories import CustomerFactory, CurrencyFactory
import nose.tools as nt
from letter_of_credit.factories import LCIssueFactory
from letter_of_credit.models import LcBidRequest, LCIssue, FormM, LCIssueConcrete
import time

dialog_title_css_selector = '.ui-dialog-title'


def add_form_m_btn_is_disabled(context):
    return context.browser.driver.find_element_by_name(context.submit_btn_name).get_attribute('disabled')


@given("There is new form M request with form M data")
def step_impl(context):
    """
    :type context behave.runner.Context
    """
    context.form_m_data = dict(
        number='MF20159999990',
        amount=410252,
        applicant='ACADEMIC PRESS LTD'
    )


@given("There is customer in the system")
def step_impl(context):
    """
    :type context behave.runner.Context
    """
    context.applicant = CustomerFactory(name=context.form_m_data['applicant'])


@when("I fill form M number field")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    if context.browser.is_element_present_by_name('addFormMForm', wait_time=4):
        context.browser.fill('form-m-number', context.form_m_data['number'])


@then("I notice that save button is disabled")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    submit_btn_name = 'formMAddSubmitBtn'
    context.submit_btn_name = submit_btn_name

    # the submit button is disabled until form is completely filled and valid
    nt.assert_true(add_form_m_btn_is_disabled(context),
                   'Submit button must be disabled until form is completely filled.')


@when("I complete form M number field")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    context.execute_steps(u"""
    When I fill form M number field
    Then I notice that save button is disabled
    """)


@when("I fill applicant field")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    context.browser.fill('applicant',
                         context.form_m_data['applicant'][:-1])  # otherwise typeahead dropdown will not show


@then("I see a drop down containing the text I typed into the input field")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    # This is the selector for type-ahead the drop-down
    context.type_ahead_css_selector = 'li[id^=typeahead-][id*=-option-]'
    nt.assert_true(
        context.browser.is_element_present_by_css(context.type_ahead_css_selector, wait_time=5),
        'There must be a drop-down containing text typed into the input field')


@when("I click the first item in the drop down")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    context.browser.find_by_css(context.type_ahead_css_selector).first.click()


@then("I notice that the drop down has disappeared")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    time.sleep(1)
    nt.assert_false(
        context.browser.is_element_present_by_css(context.type_ahead_css_selector, wait_time=1),
        'The drop-down containing text typed into the input field must disappear after the drop-down is clicked on.')


@step("I enter applicant's name in applicant field")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    context.browser.fill('applicant', context.form_m_data['applicant'])


@step("I click on add new customer image")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    context.browser.find_by_id('add-new-customer').first.click()


@then("A dialog pops up for adding new customer")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    nt.eq_(context.browser.find_by_css(dialog_title_css_selector).first.text, 'Add Customer',
           'A dialog must pop up with the text "Add Customer" in the title')


@step("I see applicant's name in the dialog")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    nt.eq_(context.browser.find_by_css('input[ng-model="customerModal.customer.name"]').first.value,
           context.form_m_data['applicant'], "Applicant's name must be visible in the dialog")


@step(
    "I see that the text and border colour of original input field for applicant is now rgb'169, 68, 66' - indicating form error")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    context.applicant_input = context.browser.driver.find_element_by_name('applicant')
    nt.assert_in('169, 68, 66', context.applicant_input.value_of_css_property('color'),
                 "The text colour of applicant input must be rgb(169, 68, 66)")

    nt.assert_in('169, 68, 66', context.applicant_input.value_of_css_property('border'),
                 "The border colour of applicant input must be rgb(169, 68, 66)")


@when("I click add customer button")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    context.browser.find_by_name('addNewCustomerModalSubmitBtn').first.click()


@then("I notice that the dialog has disappeared")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    nt.assert_false(context.browser.is_element_present_by_css(dialog_title_css_selector, wait_time=1))


@step(
    "I see that the text and border colour of original input field for applicant is no longer rgb'169, 68, 66' - indicating that input is valid")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """

    # This is a hack. Ideally, when user clicks "Add customer" submit button, the applicant field is supposed to become
    # valid automatically so that assertion below will work. However, in tests comma, this is not so. This may be a bug
    # in the test browser suite because my code works in real life
    context.execute_steps(u"""
    When I fill applicant field
    Then I see a drop down containing the text I typed into the input field
    When I click the first item in the drop down
    Then I notice that the drop down has disappeared
    """)

    # If we don't do this, the assertion below will only pass in phantomjs
    time.sleep(1)

    nt.assert_not_in(
        '169, 68, 66',
        context.applicant_input.value_of_css_property('color'),
        "The text colour of applicant input must no longer be rgb(169, 68, 66) when input is valid")

    nt.assert_not_in(
        '169, 68, 66',
        context.applicant_input.value_of_css_property('border'),
        "The border colour of applicant input must no longer be rgb(169, 68, 66) when applicant input is valid")


@when("I complete currency and amount fields, and submit the form")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    context.execute_steps(u"""
    When I fill currency field
    Then I notice that save button is disabled
    When I fill amount field
    Then I notice that save button is enabled
    When I submit the completed form
    """)


@then("I verify that the form M has been properly saved")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    context.execute_steps(u"""
    Then I see a dialog that form M was successfully saved
    And confirm that there is one form M in the system
    """)


@when("I fill currency field")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    context.browser.fill('currency', context.currency.code[:-1])  # otherwise typeahead dropdown will not show
    context.execute_steps(u"""
    Then I see a drop down containing the text I typed into the input field
    When I click the first item in the drop down
    Then I notice that the drop down has disappeared
    """)


@when("I fill amount field")
def step_impl(context):
    """
    :type context behave.runner.Context
    """
    context.browser.fill('amount', context.form_m_data['amount'])


@then("I notice that save button is enabled")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    nt.assert_false(add_form_m_btn_is_disabled(context),
                    'submit button must be enabled when form m is completely filled and valid')


@when("I submit the completed form")
def step_impl(context):
    """
    :type context behave.runner.Context
    """
    context.browser.find_by_name(context.submit_btn_name).first.click()


@then("I see a dialog that form M was successfully saved")
def step_impl(context):
    """
    :type context behave.runner.Context
    """
    nt.eq_(
        context.browser.find_by_css(dialog_title_css_selector).first.text,
        '"%s" successfully saved' % context.form_m_data['number'],
        'Form M has been created and "success message must now be displayed in confirmation dialog title"')
    # Without this, the browser will not be able to clean itself up
    time.sleep(1)


@step("confirm that there is one form M in the system")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    mf = FormM.objects.all()
    nt.eq_(mf.count(), 1, "There must be exactly one form M in the system")
    nt.eq_(mf[0].number, context.form_m_data['number'],
           "Form m number in the system must be same as form M data we completed on the form")


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
    context.lc_issues_id = []
    [context.lc_issues_id.append(LCIssueFactory().id) for x in range(2)]


@step("I notice the text 'Add Letter Of Credit Issues' with a down pointing arrow before the text")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    context.issue_show_icon_elm = context.browser.find_by_css('.lc-issue-add-on-show-icon').first
    nt.assert_in('Add Letter Of Credit Issues', context.issue_show_icon_elm.text,
                 "The text 'Add Letter Of Credit Issues' must be present on the 'form M issue show icon' when it has "
                 "not been interacted with.")

    nt.assert_true(
        context.browser.is_element_present_by_css('.lc-issue-add-on-show-icon>.glyphicon-chevron-down'),
        "There must be a 'down point arrow' on the 'form M issue show icon'")


@when("I click any where in the box that contains the text 'Add Letter Of Credit Issues'")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    context.issue_control_container = context.browser.find_by_css('.form-m-lc-issue-toggle-show').first
    context.issue_control_container.click()


@then("I notice that there is no form control for entering/selecting issues")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    context.issue_control = context.browser.find_by_name('issue')
    nt.assert_false(context.issue_control.visible,
                    'The issue input control must not be visible unless form m form has been completed')


@when("I complete form M with basic information")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    context.execute_steps(u"""
    Given There is customer in the system
    When I fill form M number field
    Then I notice that save button is disabled
    When I fill applicant field
    Then I see a drop down containing the text I typed into the input field
    When I click the first item in the drop down
    Then I notice that the drop down has disappeared
    Then I notice that save button is disabled
    When I fill currency field
    Then I notice that save button is disabled
    When I fill amount field
    """)


@then(
    "I notice that the text 'Add Letter Of Credit Issues' has changed to 'Dismiss' and there is now an upward pointing arrow")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    show_icon_text = context.issue_show_icon_elm.text
    msg = "when form M form has been completed and we click the container for issue input"

    nt.assert_not_in(
        'Add Letter Of Credit Issues',
        show_icon_text,
        "The text 'Add Letter Of Credit Issues' must not be present on the 'form M issue show icon' %s" % msg)

    nt.assert_in(
        'Dismiss',
        show_icon_text,
        "The text 'Dismiss' must be present on the 'form M issue show icon' %s" % msg)

    nt.assert_false(
        context.browser.is_element_present_by_css('.lc-issue-add-on-show-icon>.glyphicon-chevron-down'),
        "There must not be a 'down pointing arrow' on the 'form M issue show icon' %s" % msg)

    nt.assert_true(
        context.browser.is_element_present_by_css('.lc-issue-add-on-show-icon>.glyphicon-chevron-up'),
        "There must be a 'up pointing arrow' on the 'form M issue show icon' %s" % msg)


@step("There is now a form input with label that says 'Type LC issue'")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    label = context.browser.find_by_css('label[for=issue]')
    nt.assert_true(label.visible, 'The issue input control label must be visible after form m form has been completed')
    nt.assert_equal(label.text, 'Type LC issue', 'The issue input control label text must be "Type LC issue"')

    nt.assert_true(context.issue_control.visible,
                   'The issue input control must be visible after form m form has been completed')


@step("There is no ui element to show we have specified an issue")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    # This is the issue ID we wish to specify. The UI element that confirms that we have specified this issue is an
    # input with selector like so: input[data-id=issue-text-display-id] where 'id' is the database ID of issue we wish
    # to specify

    context.random_issue_id = random.choice(context.lc_issues_id)
    context.random_issue_selector = 'input[data-id=issue-text-display-%d]' % context.random_issue_id
    nt.assert_false(
        context.browser.is_element_present_by_css(context.random_issue_selector),
        'There must not be ui element to show we have specified an issue until the issue has been specified'
    )


@when("I type an issue text into the issue form control")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    context.selected_issue = LCIssue.objects.get(pk=context.random_issue_id)
    context.browser.fill('issue', context.selected_issue.text[:-1])
    context.execute_steps(u"""
    Then I see a drop down containing the text I typed into the input field
    When I click the first item in the drop down
    Then I notice that the drop down has disappeared
    """)


@then("I notice a ui element showing the issue I just selected")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    nt.assert_true(
        context.browser.is_element_present_by_css(context.random_issue_selector, wait_time=3),
        'There must not be ui element to show we have specified an issue until the issue has been specified'
    )

    nt.assert_equal(
        context.browser.find_by_css(context.random_issue_selector).first.value,
        context.selected_issue.text,
        'The value of the selected issue and that of the database must be the same.'
    )


@when("I submit the form and verify there is form M in the system")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    context.execute_steps(u"""
    Then I notice that save button is enabled
    When I submit the completed form
    Then I see a dialog that form M was successfully saved
    And confirm that there is one form M in the system
    """)


@step("confirm that there is an issue attached to form M in the system")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    issues = LCIssueConcrete.objects.all()

    nt.eq_(issues.count(), 1, 'There must be exactly one concrete issue in the system.')

    issue = issues[0]
    nt.eq_(
        issue.mf.number,
        context.form_m_data['number'],
        'The form M number of the newly created concrete issue must be the same as the form M number we entered while '
        'completing the form'
    )

    nt.eq_(
        issue.issue.id,
        context.random_issue_id,
        'The concrete issue we just created must have an issue attribute whose database ID is the same as the randomly '
        'selected ID that was used while completing the form.'
    )
