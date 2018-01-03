
from jinja_tornado import *
import tornado.web
import time
import sqlite3
class LoginHandler(BaseHandler):
    def get(self):
        self.redirect('/blogs_list')
    def post(self):
        username = self.get_argument('username')
        password = self.get_argument('password')
        request_path = self.get_argument('request_path')
        print username
        print password
        print request_path
        self.set_secure_cookie('username',self.get_argument('username'),expires_days=None,expires=time.time()+500)
        #self.redirect(request_path)

class BlogsListHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        self.render_html("blogs/blogs_list.html")

class BlogsEssayHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        self.render_html("blogs/blogs_essay.html")


class BlogsClassifyHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        self.render_html("blogs/blogs_classify.html")

    def post(self):
        dict = {}
        dict['status'] = 0
        self.write(dict)

class BlogsSqliteHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        self.render_html("blogs/blogs_sqlite.html")

    def post(self):
        sql = self.get_argument('sql')
        conn = sqlite3.connect("database/blogs_info.db")
        cursor = conn.cursor()
        cursor.execute(sql)

        result =  cursor.fetchall()
        print result
        self.write(sql)


