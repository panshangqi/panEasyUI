# -*- coding=utf-8 -*-
import sys
reload(sys)
sys.setdefaultencoding('utf8')

from jinja_tornado import *
import tornado.web
import time
import sqlite3
class LoginHandler(BaseHandler):
    def get(self):
        self.redirect('/blogs_list')
    def post(self):
        username = self.get_argument('username')
        password = self.get_argument('password')
        request_path = self.get_argument('request_path')
        self.set_secure_cookie('username',username,expires_days=None,expires=time.time()+6000)
        self.redirect(request_path)

class BlogsListHandler(BaseHandler):
    def get(self):
        try:
            username = self.get_current_user()
            conn = sqlite3.connect('database/blogs_info.db')
            conn.text_factory = str
            cursor = conn.cursor()
            sql = 'select tid from user_info where username = "%s";' % (username)
            result = cursor.execute(sql)
            user_id = -1;
            for row in result:
                user_id = row[0]

            sql = "select user_id,title,label,summary,article,create_time,alter_time from blogs_info where user_id="+str(user_id)+";"
            cursor.execute(sql)
            result = cursor.fetchall()
            blogs_list=[]
            blogs_item={}
            for row in result:
                blogs_item['title'] = row[0]
                blogs_item['label'] = row[1]
                blogs_item['summary'] = row[2]
                blogs_item['article'] = row[3]
                blogs_item['create_time'] = row[4]
                blogs_item['alter_time'] = row[5]
                blogs_list.append(blogs_item)
            print blogs_list
            conn.commit()
            cursor.close()
            conn.close()
        except:
            #traceback.print_exc()
            print 'except'
        self.render_html("blogs/blogs_list.html",blogs_list=blogs_list)

class BlogsEssayHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        print self.request
        self.render_html("blogs/blogs_essay.html")

    def post(self):
        title = self.get_argument('title')
        label = self.get_argument('label')
        article = self.get_argument('article')
        action = self.get_argument('action')
        if action == 'create':
            username = self.get_current_user()

            try:
                conn = sqlite3.connect('database/blogs_info.db')
                conn.text_factory = str
                cursor = conn.cursor()
                sql = 'select tid from user_info where username = "%s";' % (username)
                cursor.execute(sql)
                result = cursor.fetchall()
                user_id = ''
                for row in result:
                    user_id = row[0]

                sql = "insert into blogs_info(user_id,title,label,summary,article,create_time,alter_time) values(%d,'%s','%s','%s','%s',%d,%d);" % (user_id,title,label,'',article,time.time(),0)
                print sql
                cursor.execute(sql)
                conn.commit()
                cursor.close()
                conn.close()
            except:
                print 'except'
                self.write('create ok')



class BlogsClassifyHandler(BaseHandler):
    #@tornado.web.authenticated
    def get(self):
        self.render_html("blogs/blogs_classify.html")

    def post(self):
        dict = {}
        dict['status'] = 0
        self.write(dict)

class BlogsSqliteHandler(BaseHandler):
    #@tornado.web.authenticated
    def get(self):
        self.render_html("blogs/blogs_sqlite.html")

    def post(self):
        sql = self.get_argument('sql')
        conn = sqlite3.connect("database/blogs_info.db")
        cursor = conn.cursor()
        cursor.execute(sql)

        result =  cursor.fetchall()
        print result
        self.write(sql)


