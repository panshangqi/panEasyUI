# -*- coding=utf-8 -*-
import sys
reload(sys)
sys.setdefaultencoding('utf8')

from jinja_tornado import *
from HTMLParser import HTMLParser
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
#获取文章摘要
class SummaryHTMLParser(HTMLParser):

    def __init__(self, count):
        HTMLParser.__init__(self)
        self.count = count
        self.summary = u''

    def feed(self, data):
        """Only accept unicode `data`"""
        assert (isinstance(data, unicode))
        HTMLParser.feed(self, data)

    def handle_data(self, data):
        more = self.count - len(self.summary)
        if more > 0:
            # Remove possible whitespaces in `data`
            data_without_whitespace = u''.join(data.split())

            self.summary += data_without_whitespace[0:more]

    def get_summary(self, suffix=u'', wrapper=u'p'):
        return u'{1}{2}{0}'.format(wrapper, self.summary, suffix)

class BlogsListHandler(BaseHandler):
    def get(self,rout_name):
        user_id = self.get_current_user()
        blogs_list=[]
        label_list = getLabellist()
        result={}
        try:
            conn = sqlite3.connect('database/blogs_info.db')
            cursor = conn.cursor()
            cursor.execute('select blog_id,title,summary,create_time,modify_time,label_id,type,click_rate from blogs_info where user_id=:user_id order by create_time desc;',{'user_id':user_id})
            res = cursor.fetchall()
            for row in res:
                blogs_item={}
                blogs_item['blog_id'] = row[0]
                blogs_item['title'] = row[1]
                blogs_item['summary'] = row[2]
                blogs_item['create_time'] = row[3]
                blogs_item['modify_time'] = row[4]
                blogs_item['label_id'] = row[5]
                blogs_item['type'] = row[6]
                blogs_item['click_rate'] = row[7]
                blogs_list.append(blogs_item)

            conn.commit()
            cursor.close()
            conn.close()
            result['status']=1
        except:
            result['status']=0
        self.render_html("blogs/blogs_list.html",blogs_list=blogs_list,label_list=label_list)

class BlogsArticleHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        blog_id = self.get_argument('blog_id')
        user_id = self.get_current_user()
        article_info={}
        result={}
        try:
            conn = sqlite3.connect('database/blogs_info.db')
            cursor = conn.cursor()
            cursor.execute('select blog_id,title,article,create_time,type,click_rate from blogs_info where user_id=:user_id and blog_id=:blog_id',{'user_id':user_id,'blog_id':blog_id})
            res = cursor.fetchall()
            for row in res:
                blogs_item={}
                article_info['blog_id'] = row[0]
                article_info['title'] = row[1]
                article_info['article'] = row[2]
                article_info['create_time'] = row[3]
                article_info['type'] = row[4]
                article_info['click_rate'] = row[5]
            conn.commit()
            cursor.close()
            conn.close()
            result['status']=1
        except:
            result['status']=0
        self.render_html("blogs/blogs_article.html",article_info=article_info)

class BlogsEssayHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        label_list = getLabellist()
        self.render_html("blogs/blogs_essay.html",label_list=label_list)

    def post(self):
        action = self.get_argument('action')
        result={}
        if action == 'create':
            title = self.get_argument('title')
            type = self.get_argument('type')
            label_id = self.get_argument('label_id')
            article = self.get_argument('article')
            user_id = self.get_current_user()
            try:
                conn = sqlite3.connect('database/blogs_info.db')
                cursor = conn.cursor()
                parser = SummaryHTMLParser(150)
                parser.feed(article)
                blog_summary = parser.get_summary(u'...' ,u'')
                sql_param = (getGuid(),title,type,blog_summary,article,time.time(),time.time(),user_id,label_id)
                cursor.execute('insert into blogs_info(blog_id,title,type,summary,article,create_time,modify_time,user_id,label_id) values(?,?,?,?,?,?,?,?,?);',sql_param)
                conn.commit()
                cursor.close()
                conn.close()
                result['status']=1
            except:
                result['status']=0
            self.write(result)
        elif action == 'delete':
            blog_id = self.get_argument('blog_id')
            user_id = self.get_current_user()
            try:
                conn = sqlite3.connect('database/blogs_info.db')
                cursor = conn.cursor()
                cursor.execute('delete from blogs_info where blog_id=:blog_id and user_id=:user_id;',{'blog_id':blog_id,'user_id':user_id})
                conn.commit()
                cursor.close()
                conn.close()
                result['status']=1
            except:
                result['status']=0
            self.write(result)


class BlogsClassifyHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        self.render_html("blogs/blogs_classify.html")

    def post(self):
        dict = {}
        dict['status'] = 0
        self.write(dict)

class BlogsSqliteHandler(BaseHandler):
    @tornado.web.authenticated
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
    @tornado.web.authenticated
    def get(self):
        label_list = getLabellist()
        self.render_html("blogs/blogs_label.html",label_list=label_list)

    def post(self):
        action = self.get_argument('action')
        if action == 'create':
            label_name = self.get_argument('label_name')
            label_id = getGuid()
            user_id = self.get_current_user()
            result={}
            try:
                conn = sqlite3.connect("database/blogs_info.db")
                cursor = conn.cursor()
                sql_param = (label_id,user_id,label_name,time.time(),time.time())
                cursor.execute('insert into label_info(label_id,user_id,label_name,create_time,modify_time) values(?,?,?,?,?);', sql_param)
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



