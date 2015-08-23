import os
import sys
import subprocess
import atexit
import signal

from django.conf import settings
from django.contrib.staticfiles.management.commands.runserver import Command\
    as StaticfilesRunserverCommand


class Command(StaticfilesRunserverCommand):

    def inner_run(self, *args, **options):
        self.start_grunt()
        return super(Command, self).inner_run(*args, **options)

    def start_grunt(self):
        gruntfile = os.path.abspath(os.path.join('.', 'recons', 'Gruntfile.js')).replace(
            '\\', '/').replace(':', '')
        print('\n\ngruntfile = ', '/' + gruntfile, '\n\n')
        self.stdout.write('>>> Starting grunt')
        self.grunt_process = subprocess.Popen(
            # ['grunt --gruntfile=./recons/Gruntfile.js'],
            ['grunt --gruntfile=%s' % gruntfile],
            shell=True,
            stdin=subprocess.PIPE,
            stdout=self.stdout,
            stderr=self.stderr,
        )

        self.stdout.write('>>> Grunt process on pid {0}'.format(self.grunt_process.pid))

        def kill_grunt_process(pid):
            self.stdout.write('>>> Closing grunt process')
            if 'win' in sys.platform:
                subprocess.Popen(['taskkill', '/pid', str(pid)])
            else:
                os.kill(pid, signal.SIGTERM)
            self.stdout.write('>>> Grunt process closed successfully.')
        atexit.register(kill_grunt_process, self.grunt_process.pid)
