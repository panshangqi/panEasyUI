import tornado.web
from jinja2 import Environment
from jinja2 import FileSystemLoader
from jinja2 import TemplateNotFound
from jinja2 import escape

class BaseHandler(tornado.web.RequestHandler):
    def get_current_user(self):
        username = self.get_secure_cookie('username')
        return username if username else None

    def render_html(self, template_name, **kwargs):
        kwargs.update({
            'settings':self.settings,
            'static_url':'/static',
            'request':self.request,
            'current_user':self.current_user,
            'xsrf_token':self.xsrf_token,
            'xsrf_form_html':self.xsrf_form_html
        })

        template_dirs = [self.settings.get('template_path')]
        env = Environment(
            loader=FileSystemLoader(template_dirs),
        )

        try:
            template = env.get_template(template_name)
        except TemplateNotFound:
            raise TemplateNotFound(template_name)

        content = template.render(kwargs)
        self.write(content)


