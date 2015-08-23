from django import template

register = template.Library()


@register.filter(name='amtfmt')
def amt_fmt(amt, strip_neg=False):
    amt = abs(amt) if strip_neg else amt
    return "{:,.2f}".format(amt)
