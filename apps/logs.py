import traceback
import json
def tracebackLog(info):
    error = '<div>Traceback (most recent call last): </div>';
    for file, lineno, function, text in traceback.extract_tb(info[2]):
        error += '<div style="margin-top:10px">'
        error += '<div style="margin-left:20px">' + file
        error += ' line: ' + str(lineno) + ' in ' + function + '</div>'
        error += '<div style="margin-left:40px">' + text + '</div>'
        error += '</div>'
    error += '<div style="margin-top:10px;margin-left:20px">' + info[1:2].__str__() + '</div'

    print info[1:2].__str__()
    return error