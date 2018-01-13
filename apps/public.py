# -*- coding=utf-8 -*-
import sys
reload(sys)
sys.setdefaultencoding('utf8')
import os.path
import md5
import uuid
import hashlib
import smtplib
from email.header import Header
from email.mime.text import MIMEText
from PIL import Image
import ImageFilter,ImageDraw,ImageFont
import random
import redis

global_redis = redis.Redis(host='127.0.0.1',port=6379,db=0)

def getGuid():
    m_uuid = str(uuid.uuid1())
    m_md5 = hashlib.md5()
    m_md5.update(m_uuid)
    return m_md5.hexdigest()

def getGuid16():
    return getGuid()[0:16]

def getGuid8():
	return getGuid()[0:8]

def get_file_suffix(filename):
	shotname,extension = os.path.splitext(filename)
	return extension

def sendEmail(toEmail,e_title,e_content):
    msg_from='13937134284@163.com'  #发送方邮箱
    passwd='blogs123email' #填入发送方邮箱的授权码
    msg_to=toEmail            #收件人邮箱
    subject=e_title           #主题
    content=e_content      #正文
    msg = MIMEText(content,'html','utf-8')
    msg['Subject'] = Header(subject, 'utf-8').encode()
    msg['From'] = msg_from
    msg['To'] = msg_to
    try:
        s = smtplib.SMTP_SSL("smtp.163.com",timeout=30)   #邮件服务器及端口号
        s.login(msg_from, passwd)
        s.sendmail(msg_from, msg_to, msg.as_string())
        print '发送成功'
        return True
    except:
        return False
    finally:
        s.quit()

def get_random_code(len,isNum=True):
    list = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIDKLMNOPQRSTUVWXYZ0123456789'
    if isNum and isNum == True:
        list = '0123456789'
    result = ''
    for i in range(len):
        number = random.choice(list)
        result = result + number
    return result

def get_random_code_image(filepath,filename):
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
    value = '';
    for t in range(4):
        number = random.choice(list)
        value = value + number;
        draw.text([34*t+16,0],number,font=font[random.randint(0,3)],fill=(random.randint(0,255),random.randint(0,255),random.randint(0,255)))
    #image.show()
    path = os.path.join(filepath,filename)
    image.save(path)
    return value

