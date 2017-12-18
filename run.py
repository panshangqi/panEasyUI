# -×- coding=utf-8 -*-
import os.path
import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
from tornado.options import define, options
from tornado.web import RequestHandler
from jinja2 import Environment, FileSystemLoader, TemplateNotFound,ChoiceLoader

import time
from apps.components import *
import sys
reload(sys)
sys.setdefaultencoding('utf8')


settings = {'debug':True,
            "cookie_secret": "bZJc2sWbQLKos6GkHnxVB9oXwQt8S0R0kRvJ5J89E=",
            "xsrf_cookies": True
        }
define('debug',default=True,help="Debug Mode",type=bool)
define("port", default=8899, help="run on the given port", type=int)



if __name__ == '__main__':
    tornado.options.parse_command_line()
    app = tornado.web.Application(
        handlers=[(r"/index",IndexHandler),
        (r"/home",HomeHandler),
        (r"/panEasyUI",PanEasyUIHandler)],
        template_path = os.path.join(os.path.dirname(__file__),"templates"),
        static_path = os.path.join(os.path.dirname(__file__),"static"),
        **settings
    )
    http_server = tornado.httpserver.HTTPServer(app)
    http_server.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()

