# -*- coding=utf-8 -*-
import sqlite3
import os.path
import smtplib
from email.mime.text import MIMEText

def sqliteTest():
    conn = sqlite3.connect('test.db')
    print "Opened database successfully";
    cursor = conn.cursor()
    cursor.execute("select * from plugs_info")
    print cursor.fetchall()

def sendEmail():
	#msg_from='1187816874@qq.com'                                 #发送方邮箱
	msg_from='13937134284@163.com'
	#passwd='csmqytdeqvmqfjic'                                   #填入发送方邮箱的授权码
	passwd='blogs123email'
	msg_to='1187816874@qq.com'                                  #收件人邮箱
	subject="python邮件测试"                                     #主题
	content="这是我使用python smtplib及email模块发送的邮件"      #正文
	msg = MIMEText(content)
	msg['Subject'] = subject
	msg['From'] = msg_from
	msg['To'] = msg_to
	try:
	    #s = smtplib.SMTP_SSL("smtp.qq.com",465)   #邮件服务器及端口号
	    s = smtplib.SMTP_SSL("smtp.163.com",timeout=30)   #邮件服务器及端口号
	    s.login(msg_from, passwd)
	    s.sendmail(msg_from, msg_to, msg.as_string())
	    print "发送成功"
	except:
	    print "发送失败"
	#finally:
	    #s.quit()

def get_files_path():

	files_path = os.path.dirname(__file__)
	return files_path

def get_file_suffix(filename):
	shotname,extension = os.path.splitext(filename)
	return extension

from PIL import Image
import ImageFilter,ImageDraw,ImageFont
import random

def get_random_id_code():
    list = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIDKLMNOPQRSTUVWXYZ0123456789'
    font = []
    font1 = ImageFont.truetype('/usr/share/fonts/truetype/lao/Phetsarath_OT.ttf',35)
    font2 = ImageFont.truetype('/usr/share/fonts/truetype/lao/Phetsarath_OT.ttf',45)
    font3 = ImageFont.truetype('/usr/share/fonts/truetype/lao/Phetsarath_OT.ttf',30)
    font4 = ImageFont.truetype('/usr/share/fonts/truetype/lao/Phetsarath_OT.ttf',40)
    font.append(font1)
    font.append(font2)
    font.append(font3)
    font.append(font4)
    width = 160
    height = 60
    image = Image.new("RGB",(width,height),(255,255,255))
    draw = ImageDraw.Draw(image)
    for t in range(10):
        x = random.randint(0,width-1)
        y = random.randint(0,height-1)
        x1 = random.randint(0,width-1)
        y1 = random.randint(0,height-1)
        draw.line([x,y,x1,y1],fill=(random.randint(0,255),random.randint(0,255),random.randint(0,255)));
    for t in range(50):
        x = random.randint(0,width-1)
        y = random.randint(0,height-1)
        draw.ellipse([x,y,x+2,y+2], fill=(random.randint(0,255),random.randint(0,255),random.randint(0,255)))
    for t in range(4):
        draw.text([34*t+16,0],random.choice(list),font=font[random.randint(0,3)],fill=(random.randint(0,255),random.randint(0,255),random.randint(0,255)))
    #image.show()
    image.save('code.jpg')

class B(object):
    def __init__(self,name):
        self.name=name
    def getName(self):
        return 'A '+self.name

def pan():
    try:
        print 'try'
        return True
    except:
        print 'except'
        return False
    finally:
        print 'finally'
if __name__ == '__main__':

    sendEmail()
