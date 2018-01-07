# -*- coding=utf-8 -*-
import sys
reload(sys)
sys.setdefaultencoding('utf8')

from jinja_tornado import *
from public import *
import tornado.web
import time
import sqlite3
#获取标签列表
def getLabellist():
    conn = sqlite3.connect("database/blogs_info.db")
    cursor = conn.cursor()
    sql = "select label_id,label_name,click_rate,create_time,modify_time from label_info order by create_time desc;"
    cursor.execute(sql)
    result = cursor.fetchall()
    label_list = []
    for row in result:
        item={}
        item['label_id'] = row[0]
        item['label_name'] = row[1]
        item['click_rate'] = row[2]
        item['create_time'] = row[3]
        item['modify_time'] = row[4]
        label_list.append(item)
    return label_list

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
        label_list = getLabellist()
        self.render_html("blogs/blogs_essay.html",label_list=label_list)

    def post(self):
        title = self.get_argument('title')
        label_id = self.get_argument('label_id')
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

class BlogsLabelHandler(BaseHandler):
    def get(self):
        label_list = getLabellist()
        self.render_html("blogs/blogs_label.html",label_list=label_list)

    def post(self):
        action = self.get_argument('action')
        if action == 'create':
            label_name = self.get_argument('label_name')
            label_id = getGuid()
            result={}
            try:
                conn = sqlite3.connect("database/blogs_info.db")
                cursor = conn.cursor()
                sql_param = (label_id,label_name,time.time(),time.time())
                cursor.execute('insert into label_info(label_id,label_name,create_time,modify_time) values(?,?,?,?);', sql_param)
                conn.commit()
                cursor.close()
                conn.close()
                result['status'] = 1
            except:
                result['status'] = 0
            self.write(result)

        elif action == 'delete':
            label_id = self.get_argument('label_id')
            result={}
            try:
                conn = sqlite3.connect("database/blogs_info.db")
                cursor = conn.cursor()
                sql_param = (label_id)
                cursor.execute('delete from label_info where label_id = :labelId;',{'labelId':label_id})
                conn.commit()
                cursor.close()
                conn.close()
                result['status'] = 1
            except:
                result['status'] = 0
            self.write(result)

        elif action == 'modify':
            label_id = self.get_argument('label_id')
            label_name = self.get_argument('label_name')
            result={}
            try:
                conn = sqlite3.connect("database/blogs_info.db")
                cursor = conn.cursor()
                sql_param = {'label_name':label_name,'modify_time':time.time(),'label_id':label_id}
                cursor.execute('update label_info set label_name = :label_name,modify_time = :modify_time where label_id = :label_id',sql_param)
                conn.commit()
                cursor.close()
                conn.close()
                result['status']=1
            except:
                result['status']=0
            self.write(result)



