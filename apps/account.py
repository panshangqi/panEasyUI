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
            if  self.checkEmailExist(email) == False:
                self.write({'status':0,'message':'该邮箱不存在'})
            else:
                code_value = self.get_argument('code_value')
                code_md5 = self.get_argument('code_md5')
                value = global_redis.get(code_md5)
                result={'status':0,'message':'验证码错误'}
                if value:
                    str1 = code_value.lower()
                    str2 = value.lower()
                    if str1 == str2:
                        global_redis.set(code_md5,email)
                        code_info={'md5':code_md5,'email':email}
                        result={'status':1,'message':'校验成功','code_info':code_info}
                else:
                    result={'status':0,'message':'验证码已过期，请刷新'}
                self.write(result)

        elif action == 'update':
            md5 = getGuid8()
            value = get_random_code(4)
            global_redis.set(md5,value,60);  #key，value ,秒过期时间，毫秒过期时间
            code_info={'md5':md5,'value':value}
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
        md5 = self.get_argument('md5',getGuid8())
        email = self.get_argument('email')
        self.render_html("account/check_identity.html",email=email,md5=md5)

    def post(self):
        action = self.get_argument('action')
        if action == 'send_email':
            md5 = self.get_argument('md5')
            email = self.get_argument('email')
            code = get_random_code(6,True)
            res = sendEmail(email,'博客验证码','您的验证码为：'+code+',有效期30分钟')
            print email
            if res == True:
                global_redis.set(md5,code,1800)
                result={'status':1,'email_info':{'md5':md5,'email':email},'message':'验证码已发送邮箱'}
                self.write(result)
            else:
                result={'status':0,'message':'验证码未成功发送至您的邮箱，请重新发送'}
                self.write(result)

        elif action == 'submit':
            md5 = self.get_argument('md5')
            email = self.get_argument('email')
            code = self.get_argument('code')
            redis_code = global_redis.get(md5)
            if redis_code:
                if code == redis_code:
                    result={'status':1,'message':''}
                    self.write(result)
                else:
                    result={'status':0,'message':'验证码错误'}
                    self.write(result)
            else:
                result={'status':0,'message':'验证码已失效'}
                self.write(result)


class ModifyPasswordHandler(BaseHandler):
    def get(self):
        email = self.get_argument('email')
        self.render_html("account/modify_password.html",email=email)

    def post(self):
        email = self.get_argument('email')
        password = self.get_argument('password')
        result = {}
        try:
            conn = sqlite3.connect("database/blogs_info.db")
            cursor = conn.cursor()
            cursor.execute('update user_info set password=:password where email=:email', {'password':password,'email':email})
            conn.commit()
            cursor.close()
            conn.close()
            result['status']=1
        except:
            result['status']=0
        self.write(result)

class ModifySuccessfulHandler(BaseHandler):
    def get(self):
        self.render_html("account/modify_successful.html")


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