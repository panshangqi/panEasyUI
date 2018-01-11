# -*- coding=utf-8 -*-
import sys
reload(sys)
sys.setdefaultencoding('utf8')

from jinja_tornado import *
from public import *
import tornado.web
import time
import sqlite3
class SqliteUtil:
    def connectSQL(self):
        conn = sqlite3.connect("database/blogs_info.db")

class LoginHandler(BaseHandler):
    def get(self):
        self.render_html("account/login.html")
    def post(self):
        username = self.get_argument('username')
        password = self.get_argument('password')
        result={}
        try:
            conn = sqlite3.connect("database/blogs_info.db")
            cursor = conn.cursor()
            sql_param = {'username':username,'password':password}
            cursor.execute('select user_id from user_info where username=:username and password=:password', sql_param)
            res = cursor.fetchall()
            user_id = ''
            for row in res:
                user_id=row[0]
            conn.commit()
            cursor.close()
            conn.close()

            if len(res) > 0 and len(user_id) > 0:
                self.set_secure_cookie('user_id',user_id,expires_days=None,expires=time.time()+6000)
                result['status']=1
            else:
                result['status']=0
        except:
            result['status']=-1
        self.write(result)

class RegisterHandler(BaseHandler):
    def get(self):
        self.render_html("account/register.html")
    def post(self):
        username = self.get_argument('username')
        password = self.get_argument('password')
        email = self.get_argument('email')
        result={}
        if len(username) ==0 or len(password) == 0 or len(email) == 0:
            result['status']=0
        else:
            try:
                conn = sqlite3.connect("database/blogs_info.db")
                cursor = conn.cursor()
                sql_param = (getGuid(),username,password,email,time.time())
                print sql_param
                cursor.execute('insert into user_info(user_id,username,password,email,create_time) values(?,?,?,?,?);', sql_param)
                conn.commit()
                cursor.close()
                conn.close()
                result['status']=1
            except:
                result['status']=-1
        self.write(result)

class CheckIdentityHandler(BaseHandler):
    def get(self):
        self.render_html("account/check_identity.html")
class ModifyPasswordHandler(BaseHandler):
    def get(self):
        self.render_html("account/modify_password.html")
class SendEmailCodeHandler(BaseHandler):
    def post(self):
        email = self.get_argument('email')
        res = sendEmail(email,'博客注册验证码', '管好自己的验证码哦 ：<span style="color:#ff00ff">200852</span>')
        if res == True:
            self.write({'status':1})
        else:
            self.write({'status':0})


class LogoutHandler(BaseHandler):
    def get(self):
        self.clear_cookie("user_id")
        self.redirect("/login")