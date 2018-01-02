function getCookie(name) {
    var r = document.cookie.match("\\b" + name + "=([^;]*)\\b");
    return r ? r[1] : undefined;
}
$.extend({
    window:{
        http:{
            post:function(url,data,fn,complete,error) {
                data['_xsrf'] = getCookie('_xsrf');
                $.ajax({
                    'type': 'post',
                    'url': url,
                    'data': data,
                    'datatype': 'json',
                    'async':false,
                    'success': function (result) {
                        if (typeof fn === 'function') {
                            fn(result);
                        }
                    },
                    'complete': function () {
                        if (typeof complete === 'function') {
                            complete();
                        }
                    },
                    'error': function () {
                        if (typeof error === 'function') {
                            error();
                        }
                    }
                })
            }
        }
    }
})