digits_char = [str(x) for x in range(10)]

prepend_zeros = lambda required, available: ''.join('0' for c in range(required - available))
