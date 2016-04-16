from behave import *
import nose.tools as nt
import os
import time

use_step_matcher("re")

add_attachment_form_btn_id = 'add-attachment-form-m-submit-btn'


def add_attachment_button_is_disabled(context):
    return context.browser.driver.find_element_by_id(add_attachment_form_btn_id).get_attribute('disabled')


@given("There is data about attachment to be saved")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    context.attachment_data = {
        'title': 'Attachment 1', 'file_name': 'attachment-1.txt',
    }


@when("I fetch the saved form M")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    context.execute_steps(u"""
    When I double click on the search icon of 'Search Form M' field
    Then I see a dialog with title 'Search Form M'
    When I fill field 'Search Form M Number' field with number of form M I wish to work with
    And I click on 'Search Form M' button
    Then I see that dialog with title 'Search Form M' has disappeared
    Then I see that 'Form M Number' field is now filled with fetched form M number
    """)


@then("I notice a minus-sign icon preceding text 'Add attachment'")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    # time.sleep(10)
    context.attachment_minus_toggle_selector = '.add-attachment-form-toggle>.glyphicon-minus-sign'
    nt.assert_true(
            context.browser.is_element_present_by_css(context.attachment_minus_toggle_selector, wait_time=1),
            'Add attachment form toggle minus icon must be visible')


@step("I notice 'Add attachment' form is visible")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    context.add_attachment_form_name = 'addAttachmentForm'
    nt.assert_true(
            context.browser.is_element_present_by_name(context.add_attachment_form_name),
            'Add attachment form must be visible'
    )


@step("I notice 'Add attachment' button is disabled")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    nt.assert_true(
            add_attachment_button_is_disabled(context),
            'Add attachment form submit button must be disabled'
    )


@step("I notice there is no indication that any file has been selected")
def step_impl(context):
    """
    When a file has been selected, div.form-m-selected-attachment-file-display will appear in the DOM for
    every file selected

    :type context: behave.runner.Context
    """
    context.attachment_selected_display_selector = '.form-m-selected-attachment-file-display'
    nt.assert_false(
            context.browser.is_element_present_by_css(context.attachment_selected_display_selector),
            'There must be no indication that a file has been selected'
    )


@when("I fill attachment title field")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    context.add_attachment_form_title_field_name = 'attachmentTitle'
    context.browser.fill(context.add_attachment_form_title_field_name, context.attachment_data['title'])


@step("I choose attachment file")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    files_field = context.browser.driver.find_element_by_id('add-attachment-files-select')
    # files_field.click()
    files_field.send_keys(os.path.join(os.path.abspath(__file__), 'attachment-1.txt'))
    # context.browser.attach_file('files', os.path.join(os.path.abspath(__file__), 'attachment-1.txt'))


@then("I notice selected file name has appeared in the form")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    # time.sleep(5)
    selected_file_display = context.browser.find_by_css(context.attachment_selected_display_selector)
    nt.eq_(len(selected_file_display), 1, 'There must be one selected file displayed')
    nt.assert_in('1. attachment-1.txt', selected_file_display.first.text)


@then("I notice 'Add attachment' button is enabled")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    nt.assert_false(add_attachment_button_is_disabled(context), 'Add attachment form submit button must be enabled')


@when("I click 'Add attachment' button")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    context.browser.find_by_id(add_attachment_form_btn_id).first.click()
    time.sleep(100)


@then("I notice 'Add attachment' form is not visible")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    nt.assert_false(
            context.browser.is_element_present_by_name(context.add_attachment_form_name, wait_time=3),
            # 'Add attachment form must not be visible'
    )
