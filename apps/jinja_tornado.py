# -*- coding=utf-8 -*-
import tornado.web
import os.path
from jinja2 import Environment
from jinja2 import FileSystemLoader
from jinja2 import TemplateNotFound
from ui_methods import *
import traceback
import sqlite3
from apps import ui_modules

def guess_autoescape(template_name):
    if template_name is None or '.' not in template_name:
        return False
    ext = template_name.rsplit('.', 1)[1]
    return ext in ('html', 'htm', 'xml')

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
        user_info={}
        conn = sqlite3.connect("database/blogs_info.db")
        cursor = conn.cursor()
        cursor.execute('select user_id,username,email,create_time,head_img,rout_address from user_info where user_id = :user_id;',{'user_id':user_id})
        res = cursor.fetchall()
        for row in res:
            user_info['user_id'] = row[0]
            user_info['username'] = row[1]
            user_info['email'] = row[2]
            user_info['create_time'] = row[3]
            user_info['head_img'] = row[4];
            if row[4]:
                temp_path = os.path.join(self.get_cache_path(),user_info['head_img'])
                if os.path.exists(temp_path):
                    user_info['head_img_url'] = self.get_host_url() + self.get_cache_path() + user_info['head_img'];
                else:
                    user_info['head_img_url'] = self.get_host_url() + 'static/img/head_default.png'
            else:
                user_info['head_img_url'] = self.get_host_url() + 'static/img/head_default.png'
            user_info['rout_address'] = row[5];
        conn.commit()
        cursor.close()
        conn.close()
        return user_info

    def get_host_url(self):
		return self.request.protocol + '://'+ self.request.host + '/';

    def get_cache_path(self):
        return 'static/files/'

    def render_html(self, template_name, **kwargs):
        current_user = self.get_current_user_info()
        kwargs.update({
            'settings':self.settings,
            'static_url':'/static', #self.settings.get('static_path','/static'),
            'request':self.request,
            'current_user':current_user,
            'xsrf_token':self.xsrf_token,
            'xsrf_form_html':self.xsrf_form_html,
            'static_url_prefix':'/static'})
        template_dirs = [self.settings.get('template_path')]
        env = Environment(
            autoescape=guess_autoescape,
            loader=FileSystemLoader(template_dirs),
            extensions=['jinja2.ext.autoescape']
        )
        env.globals = ui_methods
        template = env.get_template(template_name)
        content = template.render(kwargs)
        self.write(content)












