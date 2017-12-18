import tornado.web
from jinja2 import Environment, FileSystemLoader, TemplateNotFound,escape

def guess_autoescape(template_name):
    if template_name is None or '.' not in template_name:
        return False
    ext = template_name.rsplit('.', 1)[1]
    return ext in ('html', 'htm', 'xml')

def json_dumps(dict):
	result = json.dumps(dict)
	return result

class TemplateRendering(object):
	def render_template(self, template_name, **kwargs):
		template_dirs = []
		if self.settings.get('template_path', ''):
			template_dirs.append(self.settings['template_path'])


		auto_escape = kwargs.get('auto_escape', guess_autoescape)
		print auto_escape
		env = Environment(
			loader=FileSystemLoader(template_dirs),
			autoescape=auto_escape,
			extensions=['jinja2.ext.autoescape'])

		try:
			template = env.get_template(template_name)
		except TemplateNotFound:
			raise TemplateNotFound(template_name)
		content = template.render(kwargs)
		return content

class BaseHandler(tornado.web.RequestHandler, TemplateRendering):

	def initialize(self):
		pass

	def get_current_user(self):
		username = self.get_secure_cookie('username')
		return username if username else None

	def render_html(self, template_name, **kwargs):
		kwargs.update({
		  'settings': self.settings,
		  'static_path': '/static',
		  'static_url': '/static',
		  'request': self.request,
		  'current_user': self.current_user,
		  'xsrf_token': self.xsrf_token,
		  'xsrf_form_html': self.xsrf_form_html
		})
		content = self.render_template(template_name, **kwargs)
		self.write(content)

