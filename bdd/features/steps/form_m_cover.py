from behave import *
import nose.tools as nt
from letter_of_credit.models import FormMCover

use_step_matcher("re")


@step("I notice the text 'Register Cover' with a down pointing arrow before the text")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    context.form_m_cover_icon_container = context.browser.find_by_css('.form-m-cover-add-on-show-icon').first
    text = context.form_m_cover_icon_container.text
    nt.assert_in(
        'Register Cover',
        text,
        'The form M cover interface icon container must contain text: %s' % text
    )

    nt.assert_true(
        context.browser.is_element_present_by_css('.form-m-cover-add-on-show-icon>.glyphicon-chevron-down'),
        'The form M cover interface icon container must contain a down pointing arrow indicating that some UI element '
        'will be revealed when clicked.'
    )


@when("I click any where in the box that contains the text 'Register Cover'")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    context.form_m_cover_ui_container = context.browser.find_by_css('.form-m-cover-toggle-show').first
    context.form_m_cover_ui_container.click()


@then("I notice that there are no ui elements for entering form M cover details")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    context.form_m_cover_form = context.browser.find_by_name('coverForm')
    nt.assert_false(
        context.form_m_cover_form.visible,
        'The form M cover form must not be visible until form M form completed.'
    )


@then("I notice that the text 'Register Cover' has changed to 'Dismiss' and there is now an upward pointing arrow")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    text = context.form_m_cover_icon_container.text
    debug_text = 'when the form M cover form container is clicked after form M form completed and cover form is not ' \
                 'visible.'

    nt.assert_not_in(
        'Register Cover',
        text,
        'The form M cover interface icon container must not contain text\n\tRegister Cover\n%s' % debug_text
    )

    nt.assert_in(
        'Dismiss',
        text,
        'The form M cover interface icon container must contain text\n\t%s\n %s' % (text, debug_text)
    )

    nt.assert_false(
        context.browser.is_element_present_by_css('.form-m-cover-add-on-show-icon>.glyphicon-chevron-down'),
        'The form M cover interface icon container must not contain a down pointing arrow %s' % debug_text
    )

    nt.assert_true(
        context.browser.is_element_present_by_css('.form-m-cover-add-on-show-icon>.glyphicon-chevron-up'),
        'The form M cover interface icon container must contain an up pointing arrow %s' % debug_text
    )


@step("There is now a form for entering form M cover details")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    nt.assert_true(
        context.form_m_cover_form.visible,
        'The form M cover form must be revealed '
        'when the form M cover form container is clicked after form M form completed and cover form is not ' \
        'visible.'
    )


@step("form M cover form amount field contains the same value as form M amount field")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    expected_value = context.browser.find_by_name('coverAmount').value
    actual_value = '{:,.2f}'.format(context.form_m_data['amount'])
    nt.eq_(
        expected_value,
        actual_value,
        'cover form amount field value (%s) must be same as form M amount (%s) just when cover form is revealed' % (
            expected_value, actual_value)
    )


@step("form M cover form cover type field has empty selection")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    # context.browser.find_by_name('coverType').value returns the option label instead of option value.
    selection_box_value = context.browser.evaluate_script("""$('[name=coverType]').val()""")
    nt.eq_(
        selection_box_value,
        ''
    )


@when("I select 'ITF' cover type")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    context.cover_type_selected = 'ITF'
    context.browser.find_by_xpath(
        '//select[@name="coverType"]//option[@label="%s"]' % context.cover_type_selected
    ).first.click()


@step("I notice there is nothing on page to indicate that cover was previously booked for this form M")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    context.form_m_cover_row_css_selector = 'tr[id^=form-m-cover-row-%s]'
    nt.assert_false(context.browser.is_element_present_by_css(context.form_m_cover_row_css_selector % ''))


@step("There is cover attached to the form M in the system")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    cover_qs = FormMCover.objects.all()
    nt.eq_(cover_qs.count(), 1)

    cover = cover_qs[0]
    context.cover_id = cover.id

    nt.eq_(cover.form_m_number(), context.form_m_data['number'])
    nt.eq_(cover.get_cover_type_display(), context.cover_type_selected)
    nt.eq_(cover.form_m_amount_formatted(), '{:,.2f}'.format(context.form_m_data['amount']))


@then("I notice there is a table row on page to indicate that cover was booked for this form M")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    nt.assert_true(context.browser.is_element_present_by_css(context.form_m_cover_row_css_selector % context.cover_id))
