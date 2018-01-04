# -*- coding=utf-8 -*-
import sys
reload(sys)
sys.setdefaultencoding('utf8')

import md5
import uuid
import hashlib
def getGuid():
    m_uuid = str(uuid.uuid1())
    m_md5 = hashlib.md5()
    m_md5.update(m_uuid)
    return m_md5.hexdigest()