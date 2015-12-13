from datetime import date

from behave import *
from selenium.webdriver import ActionChains

from adhocmodels.factories import CustomerFactory
import nose.tools as nt

from letter_of_credit.factories import FormMFactory
from letter_of_credit.models import FormM
import time

confirmation_dialog_css_selector = '.confirmation-dialog>.content'
dialog_title_css_selector = '.ui-dialog-title'
form_m_saved_success_info_template = '{applicant} - {form_m_number} - {currency_amount}\n\nForm M Number : {' \
                                     'form_m_number}\nValue         : {currency_amount}\nApplicant     : {applicant}'


def add_form_m_btn_is_disabled(context):
    return context.browser.driver.find_element_by_name(context.submit_btn_name).get_attribute('disabled')


def get_element_attribute_value(context, element_name, attribute_name):
    return context.browser.driver.find_element_by_name(element_name).get_attribute(attribute_name)


@given("There is form M request with form M data")
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
    if context.browser.is_element_present_by_name('addFormMForm', wait_time=1):
        context.browser.fill('formMNumber', context.form_m_data['number'])


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
            context.browser.is_element_present_by_css(context.type_ahead_css_selector, wait_time=0),
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
    nt.assert_false(
            context.browser.is_element_present_by_css(context.type_ahead_css_selector, wait_time=0),
            'The drop-down containing text typed into the input field must disappear after the drop-down is clicked '
            'on.')


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
        "I see that the text and border colour of original input field for applicant is now rgb'169, 68, "
        "66' - indicating "
        "form error")
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
        "I see that the text and border colour of original input field for applicant is no longer rgb'169, 68, "
        "66' - indicating that input is valid")
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


@when("I fill currency, amount and submit completed form")
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
    Then I see a dialog containing information about form M
    And I see the dialog title informing that form M was successfully saved
    And I notice that dialog contains information about saved form M
    And confirm that there is one form M in the system
    When I click on dialog close button
    Then I see that dialog has disappeared from page
    And that tab title has changed to a text containing information about saved form M
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


@step("that the tab title is 'Form M'")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    text = context.browser.find_by_css(context.active_tab_css_selector).first.text
    nt.eq_(
            text,
            'Form M',
            'Active tab title must be: %s' % text
    )


@when("I submit the completed form")
def step_impl(context):
    """
    :type context behave.runner.Context
    """
    context.browser.find_by_name(context.submit_btn_name).first.click()


@then("I see a dialog containing information about form M")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    nt.assert_true(
            context.browser.is_element_present_by_css(confirmation_dialog_css_selector),
            'Dialog with css selector "%s" must pop up after form M successfully saved.' %
            confirmation_dialog_css_selector
    )


@then("I see the dialog title informing that form M was successfully saved")
def step_impl(context):
    """
    :type context behave.runner.Context
    """
    nt.eq_(
            context.browser.find_by_css(dialog_title_css_selector).first.text,
            '"%s" successfully saved' % context.form_m_data['number'],
            'Form M has been created and "success message must now be displayed in confirmation dialog title"')


@step("I notice that dialog contains information about saved form M")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    # Will be reused in other steps
    context.confirmation_dialog = context.browser.find_by_css(confirmation_dialog_css_selector).first

    # Will be reused in other steps
    context.confirmation_dialog_debug_message = "Confirmation dialog text is:\n%s\nand must contain text:\n%s"

    text = form_m_saved_success_info_template.format(
            applicant=context.form_m_data['applicant'],
            form_m_number=context.form_m_data['number'],
            currency_amount='{} {:,.2f}'.format(context.currency.code, context.form_m_data['amount'])
    )
    nt.assert_in(text, context.confirmation_dialog.text)


@step("confirm that there is one form M in the system")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    mf = FormM.objects.all()
    nt.eq_(mf.count(), 1)
    nt.eq_(mf[0].number, context.form_m_data['number'])


@when("I click on dialog close button")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    context.browser.find_by_css('.ui-dialog-titlebar-close').first.click()


@then("I see that dialog has disappeared from page")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    nt.assert_false(
            context.browser.is_element_present_by_css(confirmation_dialog_css_selector),
            'Confirmation dialog must disappear from page when its close button is clicked.'
    )


@step("that tab title has changed to a text containing information about saved form M")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    nt.eq_(context.browser.find_by_css(context.active_tab_css_selector).first.text,
           'Details of "%s"' % context.form_m_data['number'])


@step("form M already saved in the system")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    FormMFactory(number=context.form_m_data['number'], currency=context.currency, applicant=context.applicant,
                 amount=context.form_m_data['amount'])


@when("I fill 'Form M Number', 'Applicant', 'Currency', and 'Amount' fields and submit form")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    context.execute_steps(u"""
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
    Then I notice that save button is enabled
    When I submit the completed form
     """)


@then("I see a dialog with title that says request did not succeed")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    dialog_title = "Request Not Completed"
    nt.eq_(
            context.browser.find_by_css(dialog_title_css_selector).first.text,
            dialog_title,
            'Http post action was not successful and a dialog with title "%s" must be displayed after action' %
            dialog_title)

    context.error_dialog_css_selector = '.xhr-error.ui-dialog-content'


@step("Dialog informs me that form M number must be unique")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    nt.assert_in('Error 400\nBAD REQUEST\nError in FORM M NUMBER\n- This field must be unique.',
                 context.browser.find_by_css(context.error_dialog_css_selector).first.text)


@step("I wish to change the form M number")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    context.form_number_to_changed_to = 'MF20159999991'


@step("I see that 'Form M Number' field is empty")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    nt.eq_(context.browser.find_by_name('formMNumber').first.value, '', "Form M number field must be empty")


@step("I see that 'Applicant' field is empty")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    nt.eq_(context.browser.find_by_name('applicant').first.value, '', "Applicant field must be empty")


@step("I see that 'Currency' field is empty")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    nt.eq_(context.browser.find_by_name('currency').first.value, '', "Currency field must be empty")


@step("I see that 'Amount' field is empty")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    nt.eq_(context.browser.find_by_name('amount').first.value, '', "Amount field must be empty")


@step("I see that 'Date Received' field contains today's date")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    nt.eq_(context.browser.find_by_name('receivedDate').first.value, date.today().strftime('%d-%b-%Y'))


@step("I see that 'Form M Number' field is editable")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    nt.assert_false(get_element_attribute_value(context, 'formMNumber', 'readonly'))


@step("I see that 'Applicant' field is editable")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    nt.assert_false(get_element_attribute_value(context, 'applicant', 'readonly'))


@step("I see that 'Currency' field is editable")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    nt.assert_false(get_element_attribute_value(context, 'currency', 'readonly'))


@step("I see that 'Amount' field is editable")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    nt.assert_false(get_element_attribute_value(context, 'amount', 'readonly'))


@step("I see that 'Date Received' field is editable")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    nt.assert_false(get_element_attribute_value(context, 'receivedDate', 'readonly'))


@step("I see that 'Form M Number' field has eye-open icon")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    nt.assert_true(
            context.browser.is_element_present_by_css('.form-m-number-group .glyphicon-eye-open'),
            "'Form M number' field must have eye-open icon"
    )
    nt.assert_false(
            context.browser.is_element_present_by_css('.form-m-number-group .glyphicon-pencil'),
            "'Form M number' field must not have pencil icon"
    )


@step("I see that 'Applicant' field has eye-open icon")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    nt.assert_true(
            context.browser.is_element_present_by_css('.applicant-group .glyphicon-eye-open'),
            "'Applicant' field must have eye-open icon"
    )
    nt.assert_false(
            context.browser.is_element_present_by_css('.applicant-group .glyphicon-pencil'),
            "'Applicant' field must not have pencil icon"
    )


@step("I see that 'Currency' field has eye-open icon")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    nt.assert_true(
            context.browser.is_element_present_by_css('.currency-group .glyphicon-eye-open'),
            "'Currency' field must have eye-open icon"
    )
    nt.assert_false(
            context.browser.is_element_present_by_css('.currency-group .glyphicon-pencil'),
            "'Currency' field must not have pencil icon"
    )


@step("I see that 'Amount' field has eye-open icon")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    nt.assert_true(
            context.browser.is_element_present_by_css('.amount-group .glyphicon-eye-open'),
            "'Amount' field must have eye-open icon"
    )
    nt.assert_false(
            context.browser.is_element_present_by_css('.amount-group .glyphicon-pencil'),
            "'Amount' field must not have pencil icon"
    )


@step("I see that 'Date Received' field has eye-open icon")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    nt.assert_true(
            context.browser.is_element_present_by_css('.received-date-group .glyphicon-eye-open'),
            "'Date Received' field must have eye-open icon"
    )
    nt.assert_false(
            context.browser.is_element_present_by_css('.received-date-group .glyphicon-pencil'),
            "'Date Received' field must not have pencil icon"
    )


@when("I double click on the search icon of 'Search Form M' field")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    ActionChains(context.browser.driver).double_click(
            context.browser.driver.find_element_by_id('form-m-search-trigger')).perform()


@then("I see a dialog with title 'Search Form M'")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    if context.browser.is_element_present_by_css('search-form-m-root-container', wait_time=2):
        nt.assert_is(
                'Search Form M', context.browser.find_by_css(dialog_title_css_selector)
        )


@when("I fill field 'Search Form M Number' field with number of form M I wish to edit")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    context.browser.fill('searchUploadedFormMNumber', context.form_m_data['number'])


@step("I click on 'Search Form M' button")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    context.browser.find_by_name('searchUploadedFormMSubmit').first.click()


@then("I see that dialog with title 'Search Form M' has disappeared")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    nt.assert_false(context.browser.is_element_present_by_css('search-form-m-root-container', wait_time=2))


@step("that tab title has changed to a text containing information about fetched form M")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    nt.eq_(context.browser.find_by_css(context.active_tab_css_selector).first.text,
           'Details of "%s"' % context.form_m_data['number'])


@step("'Form M Number' field is now filled with fetched form M number")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    nt.eq_(context.browser.find_by_name('formMNumber').first.value, context.form_m_data['number'])


@step("'Applicant' field is now filled with fetched form M applicant")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    nt.eq_(context.browser.find_by_name('applicant').first.value, context.form_m_data['applicant'])


@step("'Currency' field is now filled with fetched form M currency code")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    nt.eq_(context.browser.find_by_name('currency').first.value, context.currency.code)


@step("'Amount' field is now filled with fetched form M amount")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    nt.eq_(context.browser.find_by_name('amount').first.value, '{:,.2f}'.format(context.form_m_data['amount']))


@step("'Form M Number' field is not editable")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    nt.assert_true(get_element_attribute_value(context, 'formMNumber', 'readonly'))


@step("'Applicant' field is not editable")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    nt.assert_true(get_element_attribute_value(context, 'applicant', 'readonly'))


@step("'Currency' field is not editable")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    nt.assert_true(get_element_attribute_value(context, 'currency', 'readonly'))


@step("'Amount' field is not editable")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    nt.assert_true(get_element_attribute_value(context, 'amount', 'readonly'))


@step("'Date Received' field is not editable")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    nt.assert_true(get_element_attribute_value(context, 'receivedDate', 'readonly'))


@step("'Form M Number' field has pencil icon")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    nt.assert_false(
            context.browser.is_element_present_by_css('.form-m-number-group .glyphicon-eye-open'),
            "'Form M number' field must not have eye-open icon"
    )
    nt.assert_true(
            context.browser.is_element_present_by_css('.form-m-number-group .glyphicon-pencil'),
            "'Form M number' field must have pencil icon"
    )


@step("'Applicant' field has pencil icon")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    nt.assert_false(
            context.browser.is_element_present_by_css('.applicant-group .glyphicon-eye-open'),
            "'Applicant' field must not have eye-open icon"
    )
    nt.assert_true(
            context.browser.is_element_present_by_css('.applicant-group .glyphicon-pencil'),
            "'Applicant' field must have pencil icon"
    )


@step("'Currency' field has pencil icon")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    nt.assert_false(
            context.browser.is_element_present_by_css('.currency-group .glyphicon-eye-open'),
            "'Currency' field must not have eye-open icon"
    )
    nt.assert_true(
            context.browser.is_element_present_by_css('.currency-group .glyphicon-pencil'),
            "'Currency' field must have pencil icon"
    )


@step("'Amount' field has pencil icon")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    nt.assert_false(
            context.browser.is_element_present_by_css('.amount-group .glyphicon-eye-open'),
            "'Amount' field must not have eye-open icon"
    )
    nt.assert_true(
            context.browser.is_element_present_by_css('.amount-group .glyphicon-pencil'),
            "'Amount' field must have pencil icon"
    )


@step("'Date Received' field has pencil icon")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    nt.assert_false(
            context.browser.is_element_present_by_css('.received-date-group .glyphicon-eye-open'),
            "'Date Received' field must not have eye-open icon"
    )
    nt.assert_true(
            context.browser.is_element_present_by_css('.received-date-group .glyphicon-pencil'),
            "'Date Received' field must have pencil icon"
    )


@when("I click on pencil icon of form M number")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    context.browser.find_by_css('.form-m-number-group .glyphicon-pencil').first.click()


@when("I fill form M number field with form number I want to change to")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    context.browser.fill('formMNumber', context.form_number_to_changed_to)


@then("I see dialog that says form M that I changed to successfully saved")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    if context.browser.is_element_present_by_css(confirmation_dialog_css_selector, wait_time=1):
        nt.eq_(context.browser.find_by_css(dialog_title_css_selector).first.text,
               '"%s" successfully saved' % context.form_number_to_changed_to)


@step("I notice that dialog contains information about changed form M number")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    text = form_m_saved_success_info_template.format(
            applicant=context.form_m_data['applicant'],
            currency_amount='{} {:,.2f}'.format(context.currency.code, context.form_m_data['amount']),
            form_m_number=context.form_number_to_changed_to)
    nt.assert_in(text, context.browser.find_by_css(confirmation_dialog_css_selector).first.text)


@step("Form M number that I changed to is now in the system")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    nt.assert_true(FormM.objects.filter(number=context.form_number_to_changed_to).exists(),
                   'Form M number that I changed to "%s" must be in the system' % context.form_number_to_changed_to)


@step("Form M number that I changed from is no longer in the system")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    nt.assert_false(FormM.objects.filter(number=context.form_m_data['number']).exists(),
                    'Form M number that I changed from "%s" must not be in the system' % context.form_m_data['number'])


@step("Tab title has changed to a text containing information about form M I changed to")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    nt.eq_(context.browser.find_by_css(context.active_tab_css_selector).first.text,
           'Details of "%s"' % context.form_number_to_changed_to)


@step("I wish to change the form M applicant")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    context.applicant_to_change_to = 'APPLICANT TO CHANGE TO'
    CustomerFactory(name=context.applicant_to_change_to)


@when("I click on pencil icon of form M applicant")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    context.browser.find_by_css('.applicant-group .glyphicon-pencil').first.click()


@then("I see that 'Form M applicant' field has eye-open icon")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    nt.assert_true(
            context.browser.is_element_present_by_css('.applicant-group .glyphicon-eye-open'),
            "'Form M applicant' field must have eye-open icon"
    )
    nt.assert_false(
            context.browser.is_element_present_by_css('.applicant-group .glyphicon-pencil'),
            "'Form M applicant' field must not have pencil icon"
    )


@step("I see that 'Form M applicant' field is editable")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    nt.assert_false(get_element_attribute_value(context, 'applicant', 'readonly'))


@when("I fill form M applicant field with applicant I want to change to")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    context.browser.fill('applicant', context.applicant_to_change_to[:-1])


@when("I fetch the form M I wish to edit")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    context.execute_steps(u"""
    When I double click on the search icon of 'Search Form M' field
    Then I see a dialog with title 'Search Form M'
    When I fill field 'Search Form M Number' field with number of form M I wish to edit
    And I click on 'Search Form M' button
    Then I see that dialog with title 'Search Form M' has disappeared
    And that tab title has changed to a text containing information about fetched form M
    And 'Form M Number' field is now filled with fetched form M number
    And 'Applicant' field is now filled with fetched form M applicant
    And 'Currency' field is now filled with fetched form M currency code
    And 'Amount' field is now filled with fetched form M amount
    And 'Form M Number' field is not editable
    And 'Applicant' field is not editable
    And 'Currency' field is not editable
    And 'Amount' field is not editable
    And 'Date Received' field is not editable
    And 'Form M Number' field has pencil icon
    And 'Applicant' field has pencil icon
    And 'Currency' field has pencil icon
    And 'Amount' field has pencil icon
    And 'Date Received' field has pencil icon
    And I notice that save button is disabled
    """)


@step("I notice that dialog contains information about changed form M applicant")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    text = form_m_saved_success_info_template.format(
            applicant=context.applicant_to_change_to,
            currency_amount='{} {:,.2f}'.format(context.currency.code, context.form_m_data['amount']),
            form_m_number=context.form_m_data['number'])
    nt.assert_in(text, context.browser.find_by_css(confirmation_dialog_css_selector).first.text)


@step("Form M applicant that I changed to is now in the system")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    nt.eq_(FormM.objects.get(number=context.form_m_data['number']).applicant.name, context.applicant_to_change_to)
