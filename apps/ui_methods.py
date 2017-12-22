# -*- coding=utf-8 -*-
import sys
reload(sys)
sys.setdefaultencoding('utf8')
import time
import tornado.escape
#时间戳格式化
def timestamp_format(timestamp):
    time_local = time.localtime(timestamp)
    format = time.strftime('%Y-%m-%d',time_local)
    return format
def json_encode(str):
    return tornado.escape.json_encode(str)
ui_methods = {
	'timestamp_format':timestamp_format,
	'json_encode':json_encode
}


