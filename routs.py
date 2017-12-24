import sys
reload(sys)
sys.setdefaultencoding('utf-8')
from apps.components import *
from apps.plugs import *
url = [(r"/index",IndexHandler),
        (r"/home",HomeHandler),
        (r"/panEasyUI",PanEasyUIHandler),
        (r"/plugs_scroll",PlugsScrollHandler),
        (r"/.*",BaseHandler)

      ]
