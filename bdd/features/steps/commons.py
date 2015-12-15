confirmation_dialog_css_selector = '.confirmation-dialog>.content'
dialog_title_css_selector = '.ui-dialog-title'
form_m_saved_success_info_template = '{applicant} - {form_m_number} - {currency_amount}\n\nForm M Number : {' \
                                     'form_m_number}\nValue         : {currency_amount}\nApplicant     : {applicant}'


def get_element_attribute_value(context, element_name, attribute_name):
    return context.browser.driver.find_element_by_name(element_name).get_attribute(attribute_name)


def add_form_m_btn_is_disabled(context):
    return context.browser.driver.find_element_by_name(context.submit_btn_name).get_attribute('disabled')
