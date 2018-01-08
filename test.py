# -*- coding=utf-8 -*-
import sqlite3
import smtplib
from email.mime.text import MIMEText

def sqliteTest():
    conn = sqlite3.connect('test.db')
    print "Opened database successfully";
    cursor = conn.cursor()
    cursor.execute("select * from plugs_info")
    print cursor.fetchall()

def sendEmail():
	msg_from='1187816874@qq.com'                                 #发送方邮箱
	passwd='csmqytdeqvmqfjic'                                   #填入发送方邮箱的授权码
	msg_to='13937134284@163.com'                                  #收件人邮箱
	subject="python邮件测试"                                     #主题
	content="这是我使用python smtplib及email模块发送的邮件"      #正文
	msg = MIMEText(content)
	msg['Subject'] = subject
	msg['From'] = msg_from
	msg['To'] = msg_to
	try:
	    s = smtplib.SMTP_SSL("smtp.qq.com",465)   #邮件服务器及端口号
	    s.login(msg_from, passwd)
	    s.sendmail(msg_from, msg_to, msg.as_string())
	    print "发送成功"
	except:
	    print "发送失败"
	finally:
	    s.quit()
if __name__ == '__main__':
    sendEmail()
