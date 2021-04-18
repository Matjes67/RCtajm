

def timeFormat(input):
    out = ""
    input = input * 1000
    sec, ms = divmod(input, 1000)
    min, sec = divmod(sec, 60)
    if (min>59):
        hh, min = divmod(sec, 60)
        out = "%d:%02d:%02d.%03d" % (hh, min, sec, ms)
    else:
        out = "%d:%02d.%03d" % (min, sec, ms)
    return out