# -*- coding=utf-8 -*-
import sys
reload(sys)
sys.setdefaultencoding('utf8')
import time
from tornado.web import UIModule

class HelloModule(UIModule):
    def render(self):
        return '<div>Hello DWoeld</div>';