import os.path
import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
from tornado.web import RequestHandler

class IndexHandler(tornado.web.RequestHandler):
    def get(self):
        print 'get'
        self.render("test.html",data='this is log')

class HomeHandler(tornado.web.RequestHandler):
    def get(self):
        print 'get'
        self.render("home.html",data='this is log')

class PanEasyUIHandler(tornado.web.RequestHandler):
    def get(self):
        print 'get'
        self.render("panEasyUI.html",data='this is log')