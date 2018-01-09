# -*- coding=utf-8 -*-
import tornado.web
from jinja2 import Environment
from jinja2 import FileSystemLoader
from jinja2 import TemplateNotFound
from ui_methods import *
import traceback
import sqlite3

class BaseHandler(tornado.web.RequestHandler):
    def get(self):
        raise tornado.web.HTTPError(404)

    def write_error(self, status_code, **kwargs):
        type,value,tb = sys.exc_info()
        content = traceback.format_exception(type, value, tb)
        self.render('error.html',content=content,status_code=status_code)

    def get_current_user(self):
        user_id = self.get_secure_cookie('user_id')
        return user_id if user_id else None

    #查询用户信息
    def get_current_user_info(self):
        user_id = self.get_secure_cookie('user_id')
        if user_id == None:
            return {}
        user_dict = {}
        try:
            conn = sqlite3.connect('database/blogs_info.db')
            cursor = conn.cursor()
            cursor.execute('select username from user_info where user_id = :user_id;',{'user_id':user_id})
            res = cursor.fetchall()
            username = '';
            for row in res:
                username = row[0]
            user_dict['user_id']=user_id
            user_dict['username']=username
            cursor.close()
            conn.close()
        except:
            user_dict={}
        return user_dict

    def render_html(self, template_name, **kwargs):
        current_user = self.get_current_user_info()
        kwargs.update({
            'settings':self.settings,
            'static_url':self.settings.get('static_path','static'),
            'request':self.request,
            'current_user':current_user,
            'xsrf_token':self.xsrf_token,
            'xsrf_form_html':self.xsrf_form_html,
            'static_url_prefix':'/static'})
        template_dirs = [self.settings.get('template_path')]
        env = Environment(loader=FileSystemLoader(template_dirs))
        env.globals = ui_methods
        template = env.get_template(template_name)
        content = template.render(kwargs)
        self.write(content)












