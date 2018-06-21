# -*- coding=utf-8 -*-
import sys
reload(sys)
sys.setdefaultencoding('utf8')
import time
from tornado.web import UIModule

class HelloModule(UIModule):
    def render(self, *args, **kwargs):
        return '<div>Hello DWoeld</div>';

def HelloEx():
    return '<div>Hello DWoeld</div>';
