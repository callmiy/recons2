from behave import *
from letter_of_credit.factories import LCIssueFactory
from letter_of_credit.models import LCIssue, LCIssueConcrete
import nose.tools as nt
import random

use_step_matcher("re")


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
    context.browser.find_by_css('.form-m-lc-issue-toggle-show').first.click()


@then("I notice that there is no form control for entering/selecting issues")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    context.issue_control = context.browser.find_by_name('issue')
    nt.assert_false(context.issue_control.visible,
                    'The issue input control must not be visible unless form m form has been completed')


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
        context.browser.is_element_present_by_css(context.random_issue_selector, wait_time=0),
        'There must now be ui element to show we have specified an issue.'
    )

    nt.assert_equal(
        context.browser.find_by_css(context.random_issue_selector).first.value,
        context.selected_issue.text,
        'The value of the selected issue and that of the database must be the same.'
    )


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
