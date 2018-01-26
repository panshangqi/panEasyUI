# -*- coding=utf-8 -*-
import sys
reload(sys)
sys.setdefaultencoding('utf8')
import os.path
from jinja_tornado import *
from HTMLParser import HTMLParser
from public import *
import tornado.web
import time
import sqlite3

#获取文章摘要
class SummaryHTMLParser(HTMLParser):

    def __init__(self, count):
        HTMLParser.__init__(self)
        self.count = count
        self.summary = ''

    def feed(self, data):
        assert (isinstance(data, unicode))
        HTMLParser.feed(self, data)

    def handle_data(self, data):
        more = self.count - len(self.summary)
        if more > 0:
            # Remove possible whitespaces in `data`
            data_without_whitespace = ''.join(data.split())

            self.summary += data_without_whitespace[0:more]

    def get_summary(self, suffix='', wrapper='p'):
        return '{1}{2}{0}'.format(wrapper, self.summary, suffix)

class BlogsMethod(object):
    #获取标签列表
    @staticmethod
    def getLabellist(user_id):
        conn = sqlite3.connect("database/blogs_info.db")
        cursor = conn.cursor()
        cursor.execute('select label_id,label_name,click_rate,create_time,modify_time from label_info where user_id=:user_id order by create_time desc;',{'user_id':user_id})
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
    @staticmethod
    def get_blogs_list(user_id,label_id='all'):
        blogs_list=[]
        try:
            conn = sqlite3.connect('database/blogs_info.db')
            cursor = conn.cursor()
            if label_id == 'all':
                cursor.execute('select blog_id,title,summary,create_time,modify_time,label_id,type,click_rate from blogs_info where user_id=:user_id order by create_time desc;',{'user_id':user_id})
            else:
                cursor.execute('select blog_id,title,summary,create_time,modify_time,label_id,type,click_rate from blogs_info where user_id=:user_id and label_id=:label_id order by create_time desc;',{'user_id':user_id,'label_id':label_id})
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
        except:
            blogs_list=[]
        return blogs_list

class BlogsListHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        user_id = self.get_current_user()
        label_id = self.get_argument('label_id','all')
        print label_id
        blogs_list = BlogsMethod.get_blogs_list(user_id,label_id)
        label_list = BlogsMethod.getLabellist(user_id)
        self.render_html("blogs/blogs_list.html",blogs_list=blogs_list,label_list=label_list)

class BlogsHandler(BaseHandler):
    def get(self,rout_address):
        conn = sqlite3.connect("database/blogs_info.db")
        cursor = conn.cursor()
        cursor.execute('select user_id from user_info where rout_address = :rout_address;',{'rout_address':rout_address})
        res = cursor.fetchall()
        m_user_id = None
        for row in res:
            m_user_id = row[0]
        if m_user_id:
            blogs_list = BlogsMethod.get_blogs_list(m_user_id)
            label_list = BlogsMethod.getLabellist(m_user_id)
            self.render_html("blogs/blogs_list.html",blogs_list=blogs_list,label_list=label_list)
        else:
            raise tornado.web.HTTPError(404)

class BlogsArticleHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        blog_id = self.get_argument('blog_id')
        user_id = self.get_current_user()
        label_list = BlogsMethod.getLabellist(user_id)
        article_info={}
        result={}
        try:
            conn = sqlite3.connect('database/blogs_info.db')
            cursor = conn.cursor()
            cursor.execute('select blog_id,title,article,create_time,type,click_rate from blogs_info where user_id=:user_id and blog_id=:blog_id',{'user_id':user_id,'blog_id':blog_id})
            res = cursor.fetchall()
            for row in res:
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
        self.render_html("blogs/blogs_article.html",article_info=article_info,label_list=label_list)

class BlogsEssayHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        user_id = self.get_current_user()
        label_list = BlogsMethod.getLabellist(user_id)
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
        user_id = self.get_current_user()
        label_list = BlogsMethod.getLabellist(user_id)
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

class BlogsSettingHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        user_id = self.get_current_user()
        label_list = BlogsMethod.getLabellist(user_id)
        self.render_html('blogs/blogs_setting.html',label_list=label_list)

class BlogsUploadHeadHandler(BaseHandler):
    def post(self):
        result = {'status':1,'message':'文件上传成功'}
        try:
	        file_images = self.request.files.get('file',None)
	        if not file_images:
	            result['status'] = 0
	            result['message'] = '服务器未接收到文件'
	            return result
	        for img in file_images:
	            filename = img['filename']
	            extension = get_file_suffix(filename)
                if extension == '.jpg' or extension == '.png' or extension == '.bmp' or extension == '.jpeg':
                    newfilename = 'image_'+getGuid16() + extension
                    upload_path = self.get_cache_path()
                    file_path = os.path.join(upload_path,newfilename)
                    with open(file_path,'wb') as up:
                        up.write(img['body'])
                    self.save_file_to_sql(upload_path,newfilename)
                else:
                    result['status'] = 0
                    result['message'] = '图片格式不正确'
        except:
            result['status'] = -1
            result['message'] = '文件上传异常'
            print traceback.print_exc()
        self.write(result)

	#删除旧文件，并更新数据库
    def save_file_to_sql(self,upload_path,filename):
        user_id = self.get_current_user()
        conn = sqlite3.connect("database/blogs_info.db")
        cursor = conn.cursor()
        cursor.execute('select head_img from user_info where user_id = :user_id;',{'user_id':user_id})
        res = cursor.fetchall()
        for row in res:
            oldfilename = os.path.join(upload_path,row[0])
            if os.path.exists(oldfilename):
                os.remove(oldfilename)
        cursor.execute('update user_info set head_img = :filename where user_id = :user_id;',{'filename':filename,'user_id':user_id})
        conn.commit()
        cursor.close()
        conn.close()

class BlogsGetListFromLabel(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        label_id = self.get_argument('label_id')
        user_id = self.get_current_user()
        blogs_list = get_blogs_list(user_id,label_id)
        self.write(blogs_list)
