# -*- coding=utf-8 -*-

import sqlite3
def sqliteTest():
    conn = sqlite3.connect('test.db')
    print "Opened database successfully";
    cursor = conn.cursor()
    cursor.execute("select * from plugs_info")
    print cursor.fetchall()


if __name__ == '__main__':
    sqliteTest()
