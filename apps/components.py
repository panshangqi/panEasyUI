from jinja_tornado import *
import tornado.web
class IndexHandler(BaseHandler):
    def get(self):
        self.render_html("index.html")

class HomeHandler(BaseHandler):
    def get(self):
        self.render_html("home.html")

class PanEasyUIHandler(BaseHandler):
    def get(self):
        self.render_html("panEasyUI.html")

class NotFoundHandler(tornado.web.RequestHandler):
    def get(self):
        raise tornado.web.RequestHandler.write_error(self._status_code)