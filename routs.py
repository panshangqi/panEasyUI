
# -*- coding=utf-8 -*-
import sys
reload(sys)
sys.setdefaultencoding('utf8')

from apps.components import *
from apps.plugs import *
from apps.blogs import *
from apps.account import *
from apps.paint import *
url = [(r"/index",IndexHandler),

(r"/home",HomeHandler),
(r"/panEasyUI",PanEasyUIHandler),
(r"/plugs_scroll",PlugsScrollHandler),
(r"/login",LoginHandler),
(r"/logout",LogoutHandler),
(r"/register",RegisterHandler),

(r"/fill_account",FillAccountHandler),
(r"/check_identity",CheckIdentityHandler),
(r"/modify_password",ModifyPasswordHandler),
(r"/modify_successful",ModifySuccessfulHandler),

(r"/send_email_code",SendEmailCodeHandler),
(r"/blogs_list",BlogsListHandler),
(r"/blogs/(\w+)",BlogsHandler),
(r"/blogs_article",BlogsArticleHandler),
(r"/blogs_essay",BlogsEssayHandler),
(r"/blogs_classify",BlogsClassifyHandler),
(r"/blogs_sqlite",BlogsSqliteHandler),
(r"/blogs_label",BlogsLabelHandler),
(r"/blogs_setting",BlogsSettingHandler),
(r"/blogs_postdone",BlogsPostdownHandler),
(r"/blogs_upload_head",BlogsUploadHeadHandler),

(r"/paint_list",PaintListHandler),
(r"/paint_upload",UploadImageHandler),
(r"/.*",BaseHandler)

      ]
