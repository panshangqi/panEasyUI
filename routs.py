import sys
reload(sys)
sys.setdefaultencoding('utf-8')
from apps.components import *

url = [(r"/index",IndexHandler),
        (r"/home",HomeHandler),
        (r"/panEasyUI",PanEasyUIHandler),
        (r"/.*",NotFoundHandler)
      ]