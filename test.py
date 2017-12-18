
def arr(**settings):
    print settings


default = {'template':'tenplate','age':225}
if __name__ == '__main__':
    arr(path='static',**default)