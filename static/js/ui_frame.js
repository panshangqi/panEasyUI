function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}
var httpDialogTip = function(){
    var self = this;
    var html = '<div style="position: fixed;width:120px;height:25px;background-color: #8db02e;left:50%;top:-26px;z-index:100001;margin-left: -60px;text-align: center;color:#fff;line-height: 25px;font-size: 13px" class="http_dialog">请求成功</div>';
    $(document.body).append(html);
    var $httpDialog = $(document.body).find('.http_dialog');

    function showDialog(fn){
        $httpDialog.animate({'top':'0'},300,function(){
            setTimeout(function(){
                $httpDialog.animate({'top':'-26px'},200,function(){
                    if(typeof fn === 'function'){
                        fn();
                    }
                })
            },900);
        });
    }
    function hideDialog(){
        $httpDialog.animate({'top':'-26px'},200)
    }
    self.showDialog = function(flag,fn){
        if(true == flag){
            $httpDialog.html('请求成功');
        }else{
            $httpDialog.html('请求失败');
            $httpDialog.css('background-color','#f05151');
        }
        showDialog(fn);
    }
}
var tipDlg = new httpDialogTip();
$.extend({
    window:{
        http:{
            post:function(url,data,fn,animation,complete,error) {
                data['_xsrf'] = getCookie('_xsrf');
                animation = (typeof animation == 'undefined')?true:animation;
                $.ajax({
                    'type': 'post',
                    'url': url,
                    'data': data,
                    'datatype': 'json',
                    'async':false,
                    'success': function (result) {
                        if(animation){
                            tipDlg.showDialog(true,function(){
                                if (typeof fn === 'function') {
                                    fn(result);
                                }
                            });
                        }
                        else{
                            if (typeof fn === 'function') {
                                fn(result);
                            }
                        }

                    },
                    'complete': function () {
                        if (typeof complete === 'function') {
                            complete();
                        }
                    },
                    'error': function () {
                        tipDlg.showDialog(false,function(){
                            if (typeof error === 'function') {
                                error();
                            }
                        });
                    }
                });
            }
        }
    }
})