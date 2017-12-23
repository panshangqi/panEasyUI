# -*- coding=utf-8 -*-
import sys
reload(sys)
sys.setdefaultencoding('utf8')
import json
import tornado.escape

def plug_item(image,title,summary):
    item = { "image":image,"title":title,"summary":summary }
    return item;

plug_list = []
plug_list.append(plug_item('','<div style="color:#ff00ff">jQuery 滚动条美化插件</div>','基于jQuery库，支持横向滚动和纵向滚动，可以自定义滚动条宽度，颜色，透明度'))
print plug_list
plug_list = json.dumps(plug_list,encoding="UTF-8",ensure_ascii=False)
#plug_list = tornado.escape.json_encode(plug_list)
plug_list=json.loads(plug_list);
print plug_list


