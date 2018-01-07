from jinja_tornado import *
import tornado.web
class IndexHandler(BaseHandler):
    def get(self):
        self.render_html("index.html")

class HomeHandler(BaseHandler):
    def get(self):
        self.render_html("home.html")

class LoginHandler(BaseHandler):
    def get(self):
        self.render_html("login.html")
    def post(self):
        username = self.get_argument('username')
        password = self.get_argument('password')

        self.set_secure_cookie('username',username,expires_days=None,expires=time.time()+6000)
        self.redirect('/blogs_essay')

class PanEasyUIHandler(BaseHandler):
    def get(self):
        self.render_html("panEasyUI.html")

class NotFoundHandler(tornado.web.RequestHandler):
    def get(self):
        raise tornado.web.RequestHandler.write_error(self._status_code)