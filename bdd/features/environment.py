from behave import *
from splinter.browser import Browser
from django.core import management
import time


def before_all(context):
    """
    :type context behave.runner.Context
    """
    # Unless we tell test runner otherwise, set default browser to PhantomJS

    if context.config.browser:
        context.browser = Browser(context.config.browser)
    else:
        context.browser = Browser('phantomjs')

    if context.browser.driver_name == 'PhantomJS':
        context.browser.driver.set_window_size(1280, 1024)


def before_scenario(context, scenario):
    """
    :type context behave.runner.Context
    """
    # Reset database before each scenario
    management.call_command('flush', verbosity=0, interactive=False)


def after_all(context):
    """
    :type context behave.runner.Context
    """
    # required to prevent 'connection was forcibly closed' exception being thrown
    context.browser.driver.refresh()
    context.browser.quit()
    context.browser = None
