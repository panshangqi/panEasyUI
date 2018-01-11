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
    msg_from='1187816874@qq.com'  #发送方邮箱
    passwd='csmqytdeqvmqfjic' #填入发送方邮箱的授权码
    msg_to=toEmail            #收件人邮箱
    subject=e_title           #主题
    content=e_content      #正文
    msg = MIMEText(content,'html','utf-8')
    msg['Subject'] = Header(subject, 'utf-8').encode()
    msg['From'] = msg_from
    msg['To'] = msg_to
    try:
        s = smtplib.SMTP_SSL("smtp.qq.com",465)   #邮件服务器及端口号
        s.login(msg_from, passwd)
        s.sendmail(msg_from, msg_to, msg.as_string())
        return True
    except:
        return False
    finally:
        s.quit()