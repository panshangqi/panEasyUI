# -*- coding=utf-8 -*-
import sys
reload(sys)
sys.setdefaultencoding('utf8')

from jinja_tornado import *
from public import *
import tornado.web
import time
import sqlite3
import redis
import json

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
                cursor.execute('insert into user_info(user_id,username,password,email,create_time) values(?,?,?,?,?);', sql_param)
                conn.commit()
                cursor.close()
                conn.close()
                result['status']=1
            except:
                result['status']=-1
        self.write(result)

#验证码：系统随机生成4位符号的验证码，然后把该md5，验证号码，图片名称存到redis，前端通过向服务器发送md5和填写的号码进行验证比较
#md5作为验证码的唯一标识

class FillAccountHandler(BaseHandler):

    def get(self):
        self.render_html("account/fill_account.html")
    def post(self):
        action = self.get_argument('action')
        if action == 'submit':
            email = self.get_argument('email')
            code_value = self.get_argument('code_value')
            code_md5 = self.get_argument('code_md5')
            code_info = global_redis.get(code_md5)
            code_info = json.loads(code_info)
            image_path = self.get_cache_path()+code_info['img_name']
            if os.path.exists(image_path):
                os.remove(image_path)

            if  self.checkEmailExist(email) == False:
                self.write({'status':0,'message':'该邮箱不存在'})
            else:
	            result={'status':0,'message':'验证码错误'}
	            if code_info:
	                str1 = code_value.lower()
	                str2 = code_info['value'].lower()
	                if str1 == str2:
	                    result={'status':1,'message':'校验成功'}
	            self.write(result)
        elif action == 'update':
            md5 = getGuid8()
            img_name = 'code_' + md5 + '.jpg';
            value = get_random_id_code(self.get_cache_path(),img_name)
            code_dict={'img_name':img_name,'value':value}
            global_redis.set(md5,json.dumps(code_dict));
            img_url = self.get_host_url() + self.get_cache_path() + img_name
            code_info={'img_url':img_url,'md5':md5}
            result = {'status':1,'code_info':code_info}
            self.write(result)

    def checkEmailExist(self,email):

        exist = False
        try:
            conn = sqlite3.connect("database/blogs_info.db")
            cursor = conn.cursor()
            cursor.execute('select * from user_info where email =:email;', {'email':email})
            res = cursor.fetchall()
            if len(res) > 0:
                exist = True
            conn.commit()
            cursor.close()
            conn.close()
        except:
            exist = False
        return exist


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