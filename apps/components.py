from jinja_tornado import *
import tornado.escape
import json
json_decode = tornado.escape.json_decode
from apps.data.plug_data import *

class IndexHandler(BaseHandler):
    def get(self):
        plugs = plug_list
        self.render_html("index.html",plugs=plugs)

class HomeHandler(BaseHandler):
    def get(self):
        self.render_html("home.html")

class PanEasyUIHandler(BaseHandler):
    def get(self):
        self.render_html("panEasyUI.html")

class NotFoundHandler(BaseHandler):
    def get(self):
        self.render('error_404.html')