from fabric.operations import local as lrun
from fabric.state import env

env.hosts = ['localhost']
LIVE_FOLDER = 'c:/recons_live/app/recons'
LIVE_FOLDER_STATIC_FOLDER = 'c:/recons_live/app/static-files'
LIVE_FOLDER_SETTINGS_FILE = 'c:/recons_live/app/recons/recons/settings.py'
DEV_FOLDER = 'c:/recons_develop/app/recons'
BASE_TEMPLATE = 'c:/recons_live/app/recons/recons/templates/recons-base.html'
BASE_TEMPLATE_TEMP = 'c:/recons_live/app/recons/recons/templates/0000.html'
LIVE_RELOAD_TAG = '.*script src=.*http:\/\/127.0.0.1:35729\/livereload.js?ext=Chrome.*'


def deploy():
    do_dev()
    do_live()
    # do_no_network()


def do_no_network():
    lrun('rm -rf %s/*' % LIVE_FOLDER_STATIC_FOLDER)
    lrun('cd %s && python manage.py collectstatic --noinput' % LIVE_FOLDER)
    lrun('cd %s && python manage.py syncdb --noinput' % LIVE_FOLDER)
    lrun('cd %s && python manage.py migrate' % LIVE_FOLDER)
    lrun("""cd %s && sed 's/%s//' < %s > %s""" % (
        LIVE_FOLDER,
        LIVE_RELOAD_TAG,
        BASE_TEMPLATE,
        BASE_TEMPLATE_TEMP)
         )
    lrun('cd %s && mv %s %s' % (LIVE_FOLDER, BASE_TEMPLATE_TEMP, BASE_TEMPLATE))
    lrun('cd %s && echo DEBUG = False >> %s' % (LIVE_FOLDER, LIVE_FOLDER_SETTINGS_FILE))
    lrun('httpd -k restart')


def do_dev():
    lrun('cd %s && git checkout develop' % DEV_FOLDER)
    lrun('cd %s && git pull github develop' % DEV_FOLDER)
    lrun('cd %s && git push github develop' % DEV_FOLDER)
    lrun('cd %s && pip install -r requirements.txt' % DEV_FOLDER)
    lrun('cd %s && git checkout master && git merge develop' % DEV_FOLDER)
    lrun('cd %s && git push github master' % DEV_FOLDER)
    lrun('cd %s && git checkout develop' % DEV_FOLDER)


def do_live():
    lrun('cd %s && pip install -r requirements.txt' % LIVE_FOLDER)
    lrun('cd %s && git checkout -- .' % LIVE_FOLDER)
    lrun('cd %s && git pull github master' % LIVE_FOLDER)
    lrun('cd %s && npm install' % LIVE_FOLDER)
    lrun('cd %s && bower install' % LIVE_FOLDER)
    do_no_network()
