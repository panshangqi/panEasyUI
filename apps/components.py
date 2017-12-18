from jinjaloader import *
import tornado.escape
import json
json_decode = tornado.escape.json_decode


class IndexHandler(BaseHandler):
    def get(self):
        print 'get'
        self.render_html("index.html",data='this is log')

class HomeHandler(BaseHandler):
    def get(self):
        print 'get'
        self.render_html("home.html",data='this is log')

class PanEasyUIHandler(BaseHandler):
    def get(self):
        print 'get'
        self.render_html("panEasyUI.html",data='this is log')