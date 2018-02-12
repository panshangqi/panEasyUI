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


class PaintListHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        pic_list = self.get_image_list()
        self.render_html('paint/paint_list.html',pic_list=pic_list)

    def get_image_list(self):
        pic_list = []
        user_id = self.get_current_user()
        conn = sqlite3.connect("database/paint_info.db")
        cursor = conn.cursor()
        cursor.execute('select user_id,image_id,name,size,create_time from image_info where user_id = :user_id;',{'user_id':user_id})
        res = cursor.fetchall()
        for row in res:
            item = {}
            item['user_id'] = row[0]
            item['image_id'] = row[1]
            item['name'] = row[2]
            item['size'] = row[3]
            item['create_time'] = row[4]
            item['image_url'] = self.get_host_url() + 'static/files/image/' + row[2];
            pic_list.append(item)
        conn.commit()
        cursor.close()
        conn.close()
        return pic_list

class UploadImageHandler(BaseHandler):
    @tornado.web.authenticated
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
                    image_id = getGuid16()
                    newfilename = 'image_' + image_id + extension
                    upload_path = self.get_cache_path() + '/image';
                    file_path = os.path.join(upload_path,newfilename)
                    with open(file_path,'wb') as up:
                        up.write(img['body'])
                    file_size = os.path.getsize(file_path)
                    self.save_file_to_sql(newfilename,file_size,image_id)
                else:
                    result['status'] = 0
                    result['message'] = '图片格式不正确'
        except:
            result['status'] = -1
            result['message'] = '文件上传异常'
            print traceback.print_exc()
        self.write(result)

	#删除旧文件，并更新数据库
    def save_file_to_sql(self,file_name,file_size,image_id):
        user_id = self.get_current_user()
        conn = sqlite3.connect("database/paint_info.db")
        cursor = conn.cursor()
        cursor.execute("insert into image_info(user_id,image_id,name,size,create_time) values('%s','%s','%s',%d,%f);" % (user_id,image_id,file_name,file_size,time.time()))
        conn.commit()
        cursor.close()
        conn.close()

