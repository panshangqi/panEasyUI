from jinja_tornado import *

class PlugsScrollHandler(BaseHandler):
    def get(self):
        self.render_html("plugs/scroll.html")

