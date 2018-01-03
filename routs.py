import sys
reload(sys)
sys.setdefaultencoding('utf-8')
from apps.components import *
from apps.plugs import *
from apps.blogs import *
url = [(r"/index",IndexHandler),
        (r"/home",HomeHandler),
        (r"/panEasyUI",PanEasyUIHandler),
        (r"/plugs_scroll",PlugsScrollHandler),
        (r"/blogs_list",BlogsListHandler),
        (r"/blogs_essay",BlogsEssayHandler),
        (r"/blogs_classify",BlogsClassifyHandler),
        (r"/.*",BaseHandler)

      ]
