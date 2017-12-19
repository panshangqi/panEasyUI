from jinja_tornado import *
import tornado.escape
import json
json_decode = tornado.escape.json_decode


class IndexHandler(BaseHandler):
    def get(self):
        self.render_html("index.html",com=['sd','ds'])

class HomeHandler(BaseHandler):
    def get(self):
        print 'get'
        self.render_html("home.html")

class PanEasyUIHandler(BaseHandler):
    def get(self):
        print 'get'
        self.render_html("panEasyUI.html")

class NotFoundHandler(BaseHandler):
    def get(self):
        self.render('error_404.html')