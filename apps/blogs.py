
from jinja_tornado import *
import tornado.web
import sqlite3
class BlogsListHandler(BaseHandler):
    def get(self):
        self.render_html("blogs/blogs_list.html")

class BlogsEssayHandler(BaseHandler):
    def get(self):
        self.render_html("blogs/blogs_essay.html")


class BlogsClassifyHandler(BaseHandler):
    def get(self):
        self.render_html("blogs/blogs_classify.html")

    def post(self):
        dict = {}
        dict['status'] = 0
        self.write(dict)

class BlogsSqliteHandler(BaseHandler):
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


