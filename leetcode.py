# -*- coding=utf-8 -*-
import sys
reload(sys)
sys.setdefaultencoding('utf8')
import os.path
import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
from tornado.options import define, options
from tornado.web import RequestHandler
from jinja2 import Environment, FileSystemLoader, TemplateNotFound,ChoiceLoader

import time
from routs import url
from apps import ui_modules
import json
import md5
import uuid
import hashlib
import smtplib

def getGuid():
    m_uuid = str(uuid.uuid1())
    m_md5 = hashlib.md5()
    m_md5.update(m_uuid)
    return m_md5.hexdigest()

def getGuid16():
    return getGuid()[0:16]

class IndexHandler(RequestHandler):
    def get(self):
        self.render('leetcode.html')

class LoginHandler(RequestHandler):
    def post(self):
        username = self.get_argument('username')
        password = self.get_argument('password')
        result = {'status':1,'msg':'success'};
        time.sleep(2)
        if username == 'admin' and password == 'admin':
            self.write(json.dumps(result))
        else:
            result['status'] = 0;
            result['msg'] = "fail";
            self.write(json.dumps(result))
class SchoolsListHandler(RequestHandler):
    def get(self):
        result = [{'name':'luck','_id':'00121'},{'name':'pakcey','_id':'00521'}]
        self.write(json.dumps(result))
class FileUploadHandler(RequestHandler):
    def post(self):
        result = {'status':1,'message':'文件上传成功'}
        try:
            file_images = self.request.files.get('filename',None)
            if not file_images:
                result['status'] = 0
                result['message'] = ''
                self.write(json.dumps(result))
            count = 0
            for img in file_images:
                #filename = img['filename']
                count=count+1
                print count
        except:
            result['status'] = -1
            result['message'] = ''
            print "error"
        self.write(json.dumps(result))
class FileUploadHandler1(RequestHandler):
    def post(self):
        result = {'status':1,'message':'文件上传成功'}
        try:
            file_images = self.request.files.values()[0]
            if not file_images:
                result['status'] = 0
                result['message'] = ''
                self.write(json.dumps(result))
            count = 0
            print len(file_images)
            #print type(file_images[0][0])

            for img in file_images:
                #filename = img['filename']
                count=count+1
                print count
        except:
            result['status'] = -1
            result['message'] = ''
            print "error"
        self.write(json.dumps(result))
settings = {
	'debug':True,
    'cookie_secret': 'bZJc2sWbQLKos6GkHnxVB9oXwQt8S0R0kRvJ5J89E=',
    'xsrf_cookies': False,
    'login_url':'/login',
    'template_path':os.path.join(os.path.dirname(__file__),'templates'),
    'static_path':os.path.join(os.path.dirname(__file__),'static')
}

if __name__ == '__main__':

    tornado.options.parse_command_line()
    print 'port:10010'
    app = tornado.web.Application(
        handlers=[(r"/",IndexHandler),
        (r"/login",LoginHandler),
        (r"/getSchools",SchoolsListHandler),
        (r"/fileupload",FileUploadHandler),
        (r"/fileupload1",FileUploadHandler1)],

        **settings
    )
    http_server = tornado.httpserver.HTTPServer(app)
    http_server.listen(10010)
    tornado.ioloop.IOLoop.instance().start()
    print 'Done .. Bye'


