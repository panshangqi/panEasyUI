# -*- coding=utf-8 -*-
import sys
reload(sys)
sys.setdefaultencoding('utf8')
import time
#时间戳格式化
def timestamp_format(timestamp):
    time_local = time.localtime(timestamp)
    format = time.strftime('%Y-%m-%d',time_local)
    return format

ui_methods = {
	'timestamp_format':timestamp_format
}


