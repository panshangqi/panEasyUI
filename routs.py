
# -*- coding=utf-8 -*-
import sys
reload(sys)
sys.setdefaultencoding('utf8')

from apps.components import *
from apps.plugs import *
from apps.blogs import *
from apps.account import *
url = [(r"/index",IndexHandler),
(r"/home",HomeHandler),
(r"/panEasyUI",PanEasyUIHandler),
(r"/plugs_scroll",PlugsScrollHandler),
(r"/login",LoginHandler),
(r"/logout",LogoutHandler),
(r"/register",RegisterHandler),
(r"/modify_password",ModifyPasswordHandler),
(r"/check_identity",CheckIdentityHandler),
(r"/send_email_code",SendEmailCodeHandler),
(r"/blogs_list",BlogsListHandler),
(r"/blogs/(\w+)",BlogsHandler),
(r"/blogs_article",BlogsArticleHandler),
(r"/blogs_essay",BlogsEssayHandler),
(r"/blogs_classify",BlogsClassifyHandler),
(r"/blogs_sqlite",BlogsSqliteHandler),
(r"/blogs_label",BlogsLabelHandler),
(r"/blogs_setting",BlogsSettingHandler),
(r"/blogs_upload_head",BlogsUploadHeadHandler),
(r"/.*",BaseHandler)
      ]
