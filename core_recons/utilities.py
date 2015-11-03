digits_char = [str(x) for x in range(10)]

prepend_zeros = lambda required, available: ''.join('0' for c in range(required - available))

admin_url = lambda cls: '/admin/%s/' % str(getattr(cls, '_meta')).replace('.', '/')
