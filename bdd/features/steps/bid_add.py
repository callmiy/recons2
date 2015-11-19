from behave import *
from letter_of_credit.models import LcBidRequest
import nose.tools as nt

use_step_matcher("re")


@given("I notice the text 'Make Bid Request' with a down pointing arrow before the text")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    context.bid_show_icon = context.browser.find_by_css('.form-m-bid-add-on-show-icon').first
    text = context.bid_show_icon.text
    nt.assert_in(
        'Make Bid Request',
        text,
        'Bid show icon must contain the text "%s" when this ui element has not been interacted with.' % text)
    nt.assert_true(
        context.browser.is_element_present_by_css('.form-m-bid-add-on-show-icon>.glyphicon-chevron-down'),
        'Bid show icon must contain an arrow pointing downward indicating when clicked, some ui elements will be '
        'revealed'
    )


@when("I click any where in the box that contains the text 'Make Bid Request'")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    context.browser.find_by_css('.form-m-bid-toggle-show').first.click()


@then("I notice that there is no bid form visible")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    context.bid_form = context.browser.find_by_name('bidForm').first
    nt.assert_false(context.bid_form.visible, 'The bid form must not be visible until form M form is completed.')


@then("I notice that the text 'Make Bid Request' has changed to 'Dismiss' and there is now an upward pointing arrow")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    text = context.bid_show_icon.text

    nt.assert_not_in(
        'Make Bid Request',
        text,
        'Bid show icon must not contain the text "Make Bid Request" when bid form is visible, but instead contain '
        'text "%s".' % text)

    nt.assert_in(
        'Dismiss',
        text,
        'Bid show icon must not contain the text "%s" when bid form is visible.' % text)

    nt.assert_false(
        context.browser.is_element_present_by_css('.form-m-bid-add-on-show-icon>.glyphicon-chevron-down'),
        'Bid show icon must not contain an arrow pointing downward when bid form is revealed.'
    )

    nt.assert_true(
        context.browser.is_element_present_by_css('.form-m-bid-add-on-show-icon>.glyphicon-chevron-up'),
        'Bid show icon must contain an arrow pointing up when bid form is revealed'
    )


@step("Bid form is now visible")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    nt.assert_true(
        context.bid_form.visible,
        'The bid form should be visible after form M form is completed and bid form container is clicked while bid '
        'form is hidden.'
    )


@step("I notice that the bid form amount field contains the same value as form M form amount field")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    expected_value = context.browser.find_by_name('bidAmount').value
    actual_value = '{:,.2f}'.format(context.form_m_data['amount'])
    nt.eq_(
        expected_value,
        actual_value,
        'bid form amount field value (%s) must be same as form M amount (%s) just when bid form is revealed' % (
            expected_value, actual_value)
    )


@step("bid form goods description field is empty")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    nt.eq_(
        context.browser.find_by_name('bidGoodsDescription').value,
        '',
        'bid form goods description field must be empty just when the bid form is revealed.'
    )


@when("I fill in goods description")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    context.browser.fill('bidGoodsDescription', 'some nifty little goods')


@then("I confirm there is bid in the system attached to the completed form M")
def step_impl(context):
    """
    :type context behave.runner.Context
    """
    form_m_number = context.form_m_data['number']
    bid_qs = LcBidRequest.objects.all()
    nt.eq_(bid_qs.count(), 1, 'There must be exactly one bid in the system')

    context.newly_saved_bid = bid_qs[0]
    nt.eq_(
        context.newly_saved_bid.mf.number,
        form_m_number,
        'Newly created bid must have form M number "%s"' % form_m_number
    )


@step("I see that dialog contains information about saved bid")
def step_impl(context):
    """
    :type context: behave.runner.Context
    """
    text = context.confirmation_dialog.text
    text1 = 'Bid Amount     : {} {:,.2f}'.format(context.currency.code, context.newly_saved_bid.amount)
    nt.assert_in(text1, text, context.confirmation_dialog_debug_message % (text, text1))
