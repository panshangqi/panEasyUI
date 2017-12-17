from apps import *
def routsHandle():
    return [(r"/test",IndexHandler),
            (r"/home",HomeHandler),
            (r"/panEasyUI",PanEasyUIHandler)]