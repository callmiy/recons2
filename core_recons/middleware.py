import logging

log = logging.getLogger('recons_logger')


class RequestLoggingMiddleware(object):
    def process_response(self, request, response):
        log.info('%s\n' % ' '.join((
            request.META['REMOTE_ADDR'],
            request.META['SERVER_PORT'],
            request.META['REQUEST_METHOD'],
            request.get_full_path(),
            str(response.status_code),
            response.reason_phrase,
        )))

        return response
