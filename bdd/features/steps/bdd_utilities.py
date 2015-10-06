def dom_prop(context, attribute_name, attribute_value):
    script = '$("[attribute_name={attribute_value}]").prop("disabled")'.format(
        attribute_name=attribute_name, attribute_value=attribute_value)

    return context.browser.evaluate_script(script)
