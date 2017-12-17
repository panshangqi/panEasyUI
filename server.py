import os.path
import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
from tornado.web import RequestHandler
from tornado.options import define, options
from jinja2 import Environment,FileSystemLoader, TemplateNotFound
import time

settings = {'debug':True,
            "cookie_secret": "bZJc2sWbQLKos6GkHnxVB9oXwQt8S0R0kRvJ5J89E=",
            "xsrf_cookies": True
        }
define('debug',default=True,help="Debug Mode",type=bool)
define("port", default=8899, help="run on the given port", type=int)

class IndexHandler(tornado.web.RequestHandler):
    def get(self):
        print 'get'
        self.render("index.html",data='this is log')

class HomeHandler(tornado.web.RequestHandler):
    def get(self):
        print 'get'
        self.render("home.html",data='this is log')

class PanEasyUIHandler(tornado.web.RequestHandler):
    def get(self):
        print 'get'
        self.render("panEasyUI.html",data='this is log')

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

