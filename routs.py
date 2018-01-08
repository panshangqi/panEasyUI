
# -*- coding=utf-8 -*-
import sys
reload(sys)
sys.setdefaultencoding('utf8')

from apps.components import *
from apps.plugs import *
from apps.blogs import *
from apps.account import *
url = [(r"/index",IndexHandler),
        (r"/home",HomeHandler),
        (r"/panEasyUI",PanEasyUIHandler),
        (r"/plugs_scroll",PlugsScrollHandler),
        (r"/login",LoginHandler),
        (r"/register",RegisterHandler),
        (r"/blogs_list",BlogsListHandler),
        (r"/blogs_essay",BlogsEssayHandler),
        (r"/blogs_classify",BlogsClassifyHandler),
        (r"/blogs_sqlite",BlogsSqliteHandler),
        (r"/blogs_label",BlogsLabelHandler),
        (r"/.*",BaseHandler)

      ]
