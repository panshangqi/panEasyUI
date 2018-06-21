# -*- coding=utf-8 -*-
import sys
reload(sys)
sys.setdefaultencoding('utf8')
import os.path
import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
from tornado.options import define, options
from tornado.web import RequestHandler
from jinja2 import Environment, FileSystemLoader, TemplateNotFound,ChoiceLoader

import time
from routs import url
from apps import ui_modules

settings = {
	'debug':True,
    'cookie_secret': 'bZJc2sWbQLKos6GkHnxVB9oXwQt8S0R0kRvJ5J89E=',
    'xsrf_cookies': True,
    'login_url':'/login',
    'template_path':os.path.join(os.path.dirname(__file__),'templates'),
    'static_path':os.path.join(os.path.dirname(__file__),'static')
}

if __name__ == '__main__':

    tornado.options.parse_command_line()
    print 'port:8899'
    app = tornado.web.Application(
        handlers=url,
        **settings
    )
    http_server = tornado.httpserver.HTTPServer(app)
    http_server.listen(8899)
    tornado.ioloop.IOLoop.instance().start()
    print 'Done .. Bye'


