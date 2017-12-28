
from jinja_tornado import *
import tornado.web
class BlogsListHandler(BaseHandler):
    def get(self):
        self.render_html("blogs/blogs_list.html")

class BlogsEssayHandler(BaseHandler):
    def get(self):
        self.render_html("blogs/blogs_essay.html")
