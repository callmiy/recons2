import nose.tools as nt
from behave import *
from datetime import date
from selenium.webdriver import ActionChains

from adhocmodels.factories import CustomerFactory
from letter_of_credit.factories import FormMFactory
from letter_of_credit.models import FormM
from commons import (
    get_element_attribute_value,
    confirmation_dialog_css_selector,
    dialog_title_css_selector,
    form_m_saved_success_info_template
)

use_step_matcher("re")


@step("form M already saved in the system")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    FormMFactory(number=context.form_m_data['number'], currency=context.currency, applicant=context.applicant,
                 amount=context.form_m_data['amount'])


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
