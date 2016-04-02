from behave import *
import nose.tools as nt
import os

use_step_matcher("re")


def add_attachment_button_is_disabled(context):
    return context.browser.driver.find_element_by_id('add-attachment-form-submit-btn').get_attribute('disabled')


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


@then("I notice a plus-sign icon preceding text 'Add attachment'")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    nt.assert_true(
            context.browser.is_element_present_by_css('.add-attachment-form-toggle>.glyphicon-minus-sign', wait_time=1),
            'add attachment form toggle plus icon must be visible')


@step("I notice 'Add attachment' form is visible")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    nt.assert_true(
            context.browser.is_element_present_by_name('addAttachmentForm'),
            'Add attachment form must be visible'
    )


@step("I notice 'Add attachment' button is disabled")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    nt.assert_true(add_attachment_button_is_disabled(context), 'Add attachment form submit button must be disabled')


@when("I fill attachment title field")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    context.browser.fill('attachmentTitle', context.attachment_data['title'])


@step("I choose attachment file")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    pass


@then("I notice 'Add attachment' button is enabled")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    pass
