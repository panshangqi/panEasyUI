import tornado.web
from jinja2 import Environment
from jinja2 import FileSystemLoader
from jinja2 import TemplateNotFound
from jinja2 import escape
from ui_methods import *
import traceback
import StringIO

class BaseHandler(tornado.web.RequestHandler):
    def get_current_user(self):
        username = self.get_secure_cookie('username')
        return username if username else 'admin'

    def render_html(self, template_name, **kwargs):

        kwargs.update({
			'settings':self.settings,
			'static_url':self.settings.get('static_path','static'),
			'request':self.request,
			'current_user':self.current_user,
			'xsrf_token':self.xsrf_token,
			'xsrf_form_html':self.xsrf_form_html,
			'static_url_prefix':'/static'})

        template_dirs = [self.settings.get('template_path')]
        env = Environment(loader=FileSystemLoader(template_dirs))
        env.globals = ui_methods
        try:
            template = env.get_template(template_name)
            content = template.render(kwargs)
            self.write(content)
        except Exception, e:

            content = traceback.format_exc()
            self.render('error_500.html',content=content)







