var plugs_list = [];
function plug_item(image,title,summary,url){

    var item = {
        'image':image,
        'title':title,
        'summary':summary,
        'url':url
    }
    plugs_list.push(item);
}
plug_item(null,'滚动条美化插件','基于jQuery库，支持横向滚动和纵向滚动，可以自定义滚动条宽度，颜色，透明度','/panEasyUI');
plug_item(null,'日期选择器','基于jQuery库，界面清新简洁，支持自定义皮肤，多种日期格式，自定义年份范围,有中文和英文两种模式','/panEasyUI');
plug_item(null,'图片放大插件','基于jQuery库，支持多种动画模式','/panEasyUI');
plug_item(null,'下拉菜单','基于jQuery库，支持自定义皮肤，可通过回调函数获取选择的项','/panEasyUI');
plug_item(null,'弹出框插件','基于jQuery库，支持自定义弹窗大小，背景图层，风格选择，支持多种弹出效果','/panEasyUI');

function load_html()
{
    var html = '';
    for(var i in plugs_list){
        var item = plugs_list[i];
        html += '<div class="plug_box">';
        html += '<div class="plug_title">' + item.title +'</div>';
        html += '<div class="plug_summary">' + item.summary + '</div>';
        html += '<div class="plug_foot">'
        html += '<a class="view_btn" href="'+item.url+'" target="_blank">查看演示</a>';
        html += '<a class="used_btn" href="'+item.url+'">使用方法</a></div>';
        html += '</div>';
    }
    $('#plugs_list').html(html);
    /*
<div class="plug_support">
    <img src="{{static_url}}/img/chrome_logo.jpg">
    <img src="{{static_url}}/img/firefox_logo.jpg">
    <img src="{{static_url}}/img/ie_logo.jpg">
    </div>
    <div class="plug_foot">
    <div class="view_btn">查看演示</div>
    <div class="used_btn">使用方法</div>
    </div>
    </div>
    */
}
load_html();



