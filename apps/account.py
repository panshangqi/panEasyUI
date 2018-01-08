import sys
reload(sys)
sys.setdefaultencoding('utf8')

from jinja_tornado import *
from public import *
import tornado.web

class LoginHandler(BaseHandler):
    def get(self):
        self.render_html("account/login.html")
    def post(self):
        username = self.get_argument('username')
        password = self.get_argument('password')

        self.set_secure_cookie('username',username,expires_days=None,expires=time.time()+6000)
        self.redirect('/blogs_essay')

class RegisterHandler(BaseHandler):
    def get(self):
        self.render_html("account/register.html")
    def post(self):
        username = self.get_argument('username')
        password = self.get_argument('password')

        self.set_secure_cookie('username',username,expires_days=None,expires=time.time()+6000)
        self.redirect('/blogs_essay')

