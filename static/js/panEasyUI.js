//鼠标滚轮事件 chrome、 firefox、 >=ie8
$.fn.extend({
    onMouseWheel:function(fn){
        $(this).on('mousewheel DOMMouseScroll',function(e){
            if (typeof e.preventDefault === 'function')
                e.preventDefault();
            var detail = e.originalEvent.detail;
            var wheelDelta = e.originalEvent.wheelDelta;
            var direct = (typeof wheelDelta === 'undefined')? -detail:wheelDelta;
            fn(e,direct);
            return false;
        });
    }
})
//滚动条美化
$.fn.extend({
    panScrollBar:function(data){
        var defaults = {
            'width':400,
            'height':350,
            'scroll_x_width':7,
            'scroll_x_color':'#ddd',
            'scroll_x_radius':7,
            'scroll_x_thumb_color':'#aaa',//滑块颜色
            'scroll_x_thumb_radius':7,
            'scroll_x_overflow':'auto', //hidden,auto,
            'scroll_y_width':7,
            'scroll_y_radius':7,
            'scroll_y_color':'#ddd',
            'scroll_y_thumb_color':'#aaa',
            'scroll_y_thumb_radius':7,
            'scroll_y_overflow':'auto',
            'inertia_dis':100  //鼠标滚动一下的惯性移动距离 px
        };
        var settings = $.extend({},defaults,data);
        //把div里面的内容抽出来，然后放到自定义content，使用自定义bar进行滚动和操作
        var dom = $(this).html();
        var html = '<div class="scroll-content"></div><div class="scroll-x-bar"><div class="scrollbar-x-thumb"></div></div>';
        html += '<div class="scroll-y-bar"><div class="scrollbar-y-thumb"></div></div><div class="scroll-over-layer"></div>';
        $(this).html(html);
        var self = $(this);
        var $content = $(this).find('.scroll-content');
        $content.html(dom);
        var $scrollXBar = $(this).find('.scroll-x-bar');
        var $scrollYBar = $(this).find('.scroll-y-bar');
        var $thumbX = $scrollXBar.find('.scrollbar-x-thumb');
        var $thumbY = $scrollYBar.find('.scrollbar-y-thumb');
        var $overLayer = $(this).find('.scroll-over-layer');

        var contentWidth =$content.width();
        var contentHeight = $content.height();

        $(this).css({
            'width':settings.width + 'px',
            'height':settings.height + 'px',
            'overflow':'hidden'
        });

        $overLayer.css({
            'width':settings.width + 'px',
            'height':(settings.height-settings.scroll_y_width) + 'px'
        })
        $scrollYBar.css({
            'height':settings.height + 'px',
            'width':settings.scroll_y_width + 'px',
            'left':(settings.width - settings.scroll_y_width)+'px',
            'background-color':settings.scroll_y_color,
            'border-radius':settings.scroll_y_radius + 'px'
        });
        $scrollXBar.css({
            'height':settings.scroll_x_width + 'px',
            'width':settings.width + 'px',
            'top':(settings.height - settings.scroll_x_width)+'px',
            'background-color':settings.scroll_x_color,
            'border-radius':settings.scroll_x_radius + 'px'
        })
        var scroll_info = {
            'scrollY':false,
            'scrollX':false
        };
        if(settings.scroll_y_overflow == 'auto'){
            scrollYEvent();
            scroll_info.scrollY = true;
        }else{
            $scrollYBar.css('display','none');
        }
        if(settings.scroll_x_overflow == 'auto'){
            mouseMoveEvent();
            scroll_info.scrollX = true;
        }else{
            $scrollXBar.css('display','none');
        }
        //如果两个滚动条都显示:
        function scrollYEvent()
        {
            var contentTop = 0;
            if(contentHeight <= settings.height)
            {
                $scrollYBar.css('display','none');
                return;
            }
            var contentDis = contentHeight - settings.height; //遮挡住的高度
            //计算滑块高度：公式 盒子高度/实际高度 = 滑块高度/滚动条长度（盒子高度）；
            var rate = settings.height*1.0/contentHeight;
            var thumbHeight = parseInt(settings.height*rate);
            var thumbTop = 0;
            var thumbDis = settings.height - thumbHeight;
            $thumbY.css({
                'height':thumbHeight+'px',
                'background-color':settings.scroll_y_thumb_color,
                'border-radius':settings.scroll_y_thumb_radius + 'px'
            });
            //鼠标滑轮参数------------------
            var moveThead = null;
            var speed = 1;  //移动的速度，函数执行的时间差
            var conMoveVal = 2;
            var contentEndTop = 0;  //停止的位置
            var thumbMoveVal = thumbDis*conMoveVal*1.0/contentDis; //计算滑块每步移动的距离float
            self.onMouseWheel(function(e,detail){
                if(moveThead)
                    clearInterval(moveThead);
                if(detail > 0){ //上滚

                    conMoveVal = Math.abs(conMoveVal);
                    contentEndTop = contentTop + settings.inertia_dis;
                    if(contentTop >= 0)
                        return;
                    if(contentEndTop > 0)
                        contentEndTop = 0;
                    thumbMoveVal = -Math.abs(thumbMoveVal);
                    moveThead=setInterval(SmoothMoveThread,speed);
                }
                else{
                    conMoveVal = -Math.abs(conMoveVal);;
                    contentEndTop = contentTop - settings.inertia_dis;
                    if(contentTop <= -contentDis)
                        return;
                    if(contentEndTop < -contentDis)
                        contentEndTop = -contentDis;

                    thumbMoveVal = Math.abs(thumbMoveVal);
                    moveThead=setInterval(SmoothMoveThread,speed);
                }
            });
            function SmoothMoveThread(){
                contentTop += conMoveVal;
                thumbTop += thumbMoveVal;
                if(conMoveVal > 0 && contentTop >= contentEndTop)
                {
                    contentTop = contentEndTop;
                    clearInterval(moveThead);
                }
                else if(conMoveVal < 0 && contentTop <= contentEndTop)
                {
                    contentTop = contentEndTop;
                    clearInterval(moveThead);
                }
                $content.css({'margin-top': contentTop + 'px'});
                $thumbY.css({'margin-top': thumbTop + 'px'});
            }
        }

        //针对X滚动
        function mouseMoveEvent(){

            //鼠标拖动参数-------------------------
            console.log(contentWidth +'===' + settings.width);
            var contentLeft = 0;
            if(contentWidth <= settings.width)
            {
                $scrollXBar.css('display','none');
                return;
            }
            var contentDis = contentWidth - settings.width;
            //计算滑块高度：公式 盒子高度/实际高度 = 滑块高度/滚动条长度（盒子高度）；
            var rate = settings.width*1.0/contentWidth;
            var thumbLong = parseInt(settings.width*rate);
            var thumbLeft = 0;

            var thumbDis = settings.width - thumbLong;
            var moveRate = thumbDis/contentDis;

            $thumbX.css({
                'width':thumbLong+'px',
                'background-color':settings.scroll_x_thumb_color,
                'border-radius':settings.scroll_x_thumb_radius + 'px'
            });

            var contentPreLeft = 0;
            var start_x = 0;
            var end_x = 0;
            var thumbPreLeft = 0;
            var mouseDown = false;
            $thumbX.on('mousedown',function (event) {
                start_x = event.pageX;
                thumbPreLeft = thumbLeft;
                contentPreLeft = contentLeft;
                mouseDown = true;
                $content.addClass('not-selected');
            })
            $(window).on('mousemove',function (event) {
                if(mouseDown){
                    end_x = event.pageX;
                    thumbLeft = thumbPreLeft + end_x - start_x;
                    contentLeft = contentPreLeft + (start_x - end_x)/moveRate;
                    if(thumbLeft >= thumbDis) {
                        thumbLeft = thumbDis;
                        contentLeft = -contentDis;
                    }else if(thumbLeft <= 0){
                        thumbLeft = 0;
                        contentLeft = 0;
                    }
                    $thumbX.css({'margin-left': thumbLeft + 'px'});
                    $content.css({'margin-left': contentLeft + 'px'});
                }
            })
            $(window).on('mouseup',function(){
                mouseDown = false;
                $content.removeClass('not-selected');
            })

        }
    }
});
//$('#test_scroll').panScrollBar({'width':600,'scroll_y_overflow':'auto'});
//下拉框选择器
$.fn.extend({
    selectorInit:function(data,fn){
        var defaults = {
            'width':280,
            'expandType': 'touch',  //下拉框触发模式 'touch' 'click'
            'optionsHeight':200,
            'text':{'tId':'demo','tName':'demo'},
            'options':[{'tId':'demo','tName':'demo'},
                {'tId':'demo','tName':'demo'},
                {'tId':'demo','tName':'demo'},
                {'tId':'demo','tName':'demo'}]
        }
        var settings = $.extend({},defaults,data);
        var html = '';
        //初始化默认选择项
        html += '<div class="pan-text" tId="'+settings.text.tId+'">' + settings.text.tName +'</div>';
        html += '<div class="pan-btn"><span></span></div>';
        html += '<div class="pan-scroll-box">';
        //加载列表项
        for(var i in settings.options){
            html += '<div class="item-li" tId="'+settings.options[i].tId+'">' + settings.options[i].tName + '</div>';
        }
        html += '</div>';
        $(this).html(html);
        var self = $(this);
        //初始化自定义列表框
        $(this).css('width',settings.width + 'px');
        self.find('.pan-text').css({
            'width':(settings.width-36) + 'px'
        });

        var $panScrollBox = $(this).find('.pan-scroll-box');

        $panScrollBox.panScrollBar({
            'width':settings.width,
            'height':settings.optionsHeight
        });
        //display = none一定要放到对象初始化后面
        $panScrollBox.css({
            'position':'absolute',
            'left':'-1px',
            'top':'29px',
            'background-color':'#fff',
            'z-index':'10001',
            'border':'1px solid #80bc71',
            'display':'none'
        })
        //Event
        if(settings.expandType == 'click'){
            self.on('click',function(){
                $panScrollBox.css('display','block');
            })
        }
        else if(settings.expandType == 'touch') {
            self.on('mouseenter', function () {
                $panScrollBox.css('display','block');
            })
        }
        self.on('mouseleave',function () {
            $panScrollBox.css('display','none');
        })
        self.on('click','.item-li',function(){
            self.find('.pan-text').html($(this).html());
            self.find('.pan-text').attr('tId',$(this).attr('tId'));
            $panScrollBox.css('display','none');
            if(typeof fn  === 'function'){
                var tid = self.find('.pan-text').attr('tId');
                var tname = self.find('.pan-text').html();
                var item = {
                    'tId':tid,
                    'tName':tname
                }
                fn(item);
            }
        })
    }
})
/*
//------------------使用方法---------------------
$('#test_selector').selectorInit({
    width:280,
    expandType:'touch',
    optionsULHeight:360,
    text:{'tId':'上海','tName':'上海'},
   options:[{'tId':'上海','tName':'上海'},
       {'tId':'北京','tName':'北京'},
       {'tId':'深圳','tName':'深圳'},
       {'tId':'江苏','tName':'江苏'},
       {'tId':'山东','tName':'山东'},
       {'tId':'广东','tName':'广东'},
       {'tId':'江西','tName':'江西'},
       {'tId':'南京','tName':'南京'},
       {'tId':'江苏','tName':'江苏'},
       {'tId':'陕西','tName':'陕西'},
       {'tId':'河南','tName':'河南'},
       {'tId':'河北','tName':'河北'},
       {'tId':'山西','tName':'山西'},
       {'tId':'天津','tName':'天津'}]
},function(data){
    console.log(JSON.stringify(data));
});

$('#test_selector1').selectorInit({
    width:120,
    text:{'tId':'火星','tName':'火星'},
    options:[{'tId':'火星','tName':'火星'},
        {'tId':'木星','tName':'木星'},
        {'tId':'水星','tName':'水星'},
        {'tId':'金星','tName':'金星'},
        {'tId':'天王星','tName':'天王星'},
        {'tId':'海王星','tName':'海王星'},
        {'tId':'冥王星','tName':'冥王星'},
        {'tId':'地球','tName':'地球'},
        {'tId':'太阳','tName':'太阳'}]
},function(data){
    console.log(JSON.stringify(data));
});
*/
//-------------------------------------------
//图片放大插件
$.fn.extend({
    ZoomInit:function(data){
        var self = $(this);
        var bgHtml = '<div class="imageBg"></div>';
        $(this).append(bgHtml);
        $imageBg = self.find('div.imageBg');

        var $image = $(this).find('img');
        if(data.imageWidth && typeof data.imageWidth === 'number') {
            $image.css('width',data.imageWidth+'px');
        }
        if(data.imageHeight && typeof data.imageHeight === 'number') {
            $image.css('height',data.imageHeight+'px');
        }
        var scale = 2.0;
        if(data.scale && typeof data.scale === 'number'){
            scale = data.scale;
        }
        var windowWidth = $(document).width();
        var windowHeight = $(document).height();
        var srcImgW = $image.width();
        var srcImgH = $image.height();
        var srcImgL = self.offset().left;
        var srcImgT = self.offset().top;
        var curImgW = srcImgW*scale;
        var curImgH = srcImgH*scale;
        if(curImgW >= windowWidth || curImgH >= windowHeight){
            curImgW = windowWidth *0.8;
            curImgH = (srcImgH*1.0/srcImgW)*curImgW;
        }
        var curImgL = (windowWidth - curImgW)/2.0;
        var curImgT = (windowHeight - curImgH)/2.0;
        self.css('width', srcImgW+'px');
        self.css('height',srcImgH+'px');

        $imageBg.css({
            'width':'100%',
            'height':'100%',
            'position':'absolute',
            'left':'0',
            'top':'0',
            'background-color':'#666',
            'display':'none',
            'z-index':1000
        });
        var enlarge = false;
        $image.on('click',function(){
            if(!enlarge)
            {
                $image.css('position','absolute');
                $image.css('z-index','1001');
                console.log($image.offset().top);
                $imageBg.css('display','block');
                $imageBg.css(transparentAlpha(0.0));
                $imageBg.animate(transparentAlpha(0.5),250);
                $image.animate({'width':curImgW+'px','height':curImgH+'px','left':curImgL + 'px','top':curImgT+'px'},250,function(){
                    enlarge = true;
                });
            }
            else{
                srcImgL = self.offset().left;
                srcImgT = self.offset().top;
                $imageBg.animate(transparentAlpha(0.0),250,function(){
                    $imageBg.css('display','none');
                });
                $image.animate({'width':srcImgW+'px','height':srcImgH+'px','left':srcImgL+'px','top':srcImgT+'px'},250,function(){
                    enlarge = false;
                    $image.css('position','static');
                });
            }
        })
        $image.on('mouseenter',function(){
            if(!enlarge)
                $image.css('cursor','zoom-in');
            else
                $image.css('cursor','zoom-out');
        })
        function transparentAlpha(value){
            var alp = (100 * value)+'';
            value = value + '';
            var dict = {
                'filter':'alpha(opacity=50)',
                '-moz-opacity':value,
                '-khtml-opacity':value,
                'opacity':value
            };
            return dict;
        }
    }
});
/*使用方法*/
/*
$('#test_zoomify').ZoomInit({
    'imageWidth':360,
    'imageHeight':'auto',
    'scale':3.1
});
$('#test_zoomify1').ZoomInit({
    'imageWidth':100,
    'imageHeight':'auto',
    'scale':3.1
});
*/
//时间日期插件
$.fn.extend({
    panDateTimePicker:function(data){
        var months_arr = [null,31,29,31,30,31,30,31,31,30,31,30,31];
        var week_arr_en = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
        var week_arr_ch = ['日','一','二','三','四','五','六'];
        var defaults = {
            'start_year':1990,
            'end_year':2030,
            'format':'mm/dd/yyyy'
        };
        var settings = $.extend({},defaults,data);

        var now = new Date();
        var mYear = now.getFullYear();
        var mMonth = now.getMonth() + 1;
        var mDay = now.getDate();
        $(this).html('<label class="date-show"></label>');
        $(this).append('<div class="picker-box"></div>');
        var html = '<div class="picker-header">';
        html += '<div class="left-btn"></div>';
        html += '<div class="year-selector"><a class="year-text">2017</a><span class="year-btn"></span>';
        html += '<div class="pan-scroll-box" id="year-list"></div></div>'; //调用滚动条插件

        html += '<div class="month-selector"><a class="month-text">09</a><span class="month-btn"></span>';
        html += '<div class="pan-scroll-box" id="month-list"></div></div>';

        html += '<div class="right-btn"></div>';
        html += '</div>';
        html += '<div class="picker-week">';
        for(var i=0;i<7;i++){
            html += '<span>'+week_arr_ch[i]+'</span>';
        }
        html += '</div>';
        html += '<div class="picker-days"></div>';
        $(this).find('.picker-box').html(html);
        html = '';
        var year_count = 0;
        for(var i=settings.start_year;i<=settings.end_year;i++){
            html += '<div class="item-li" style="width:60px;">'+i+'</div>';
            year_count++;
        }
        $(this).find('#year-list').html(html);
        html = '';
        for(var i=1;i<=12;i++){
            html += '<div class="item-li" style="width:45px;">'+i+'</div>';
        }
        $(this).find('#month-list').html(html);
        var $self = $(this);

        //设置年份滚动条
        var $year_list = $(this).find('#year-list');
        var yearScrollHeight = 240 < year_count*20 ? 240:year_count*20;
        $year_list.panScrollBar({
            'width':60,
            'height':yearScrollHeight
        });
        $year_list.css({
            'position':'absolute',
            'border':'1px solid #80bc71',
            'background-color':'#fff',
            'top':'20px',
            'left':'-5px',
            'z-index':'20001',
            'display':'none'
        });
        var $month_list = $(this).find('#month-list');

        $month_list.panScrollBar({
            'width':45,
            'height':240
        });
        $month_list.css({
            'position':'absolute',
            'border':'1px solid #80bc71',
            'background-color':'#fff',
            'top':'20px',
            'left':'-5px',
            'z-index':'20001',
            'display':'none'
        });

        //init days
        updateMonths(mYear,mMonth);

        $(this).find('.year-selector').on('mouseenter',function(){
            $year_list.css('display','block');
        })
        $(this).find('.year-selector').on('mouseleave',function () {
            $year_list.css('display','none');
        })
        $year_list.on('click','.item-li',function(){
            var curYear = $(this).html();
            var curMonth = $self.find('.month-text').html();
            $self.find('.year-text').html(curYear);
            $year_list.css('display','none');
            updateMonths(parseInt(curYear),parseInt(curMonth));
        })
        $(this).find('.month-selector').on('mouseenter',function(){
            $month_list.css('display','block');
        })

        $(this).find('.month-selector').on('mouseleave',function () {
            $month_list.css('display','none');
        })

        $self.find('.picker-box').css({
            'display':'none'
        })
        //Event
        $month_list.on('click','.item-li',function(){
            var curYear = $self.find('.year-text').html();
            var curMonth = $(this).html();
            $self.find('.month-text').html(curMonth);
            $month_list.css('display','none');
            updateMonths(parseInt(curYear),parseInt(curMonth));
        })
        $(this).find('.picker-days').on('click','span',function(){
            var curYear = $self.find('.year-text').html();
            var curMonth = $self.find('.month-text').html();
            var curDay = $(this).html();
            $self.find('.date-show').html(formatDateTime(curYear,curMonth,curDay));
            $self.find('.picker-box').css('display','none');
        })
        $(this).find('.date-show').on('click',function(){
            $self.find('.picker-box').css('display','block');
        })

        function updateMonths(year,month){
            $self.find('.year-text').html(year);
            $self.find('.month-text').html(month);
            if((year%400 == 0) || (year%4 == 0 && year%100 != 0)){
                months_arr[2] = 29;
            }else{
                months_arr[2] = 28;
            }
            var week_id = getWeek(year,month,1);
            var htm= '';
            var total_days = months_arr[month];
            for(var i=0;i<7;i++){
                if(i < week_id)
                    htm += '<span style="visibility:hidden">&nbsp;</span>';
            }
            for(var i=1;i<=total_days;i++){
                htm += '<span>'+i+'</span>';
            }
            $self.find('.picker-days').html(htm);
        }
        //getWeek(2010,1,7);
        function getWeek(year,month,day){
            var myDate = new Date(year+'/'+month+'/'+day);
            var week = myDate.getDay();
            return week;
        }
        function formatDateTime(year,month,day){
            if(typeof month === 'string'){
                month = parseInt(month);
            }
            if(typeof day === 'string'){
                day = parseInt(day);
            }
            month = (month < 10 ? '0'+month:month);
            day = (day < 10 ? '0'+day:day);
            var format = '';
            if(settings.format == 'yyyy-mm-dd'){
                format = year + '-' + month + '-' +day;
            }else if(settings.format == 'mm/dd/yyyy'){
                format = month + '/' + day + '/' +year;
            }else if(settings.format == 'yyyy/mm/dd'){
                format = year + '/' + month + '/' +day;
            }
            return format;
        }
    }
});
/*
$('#test_datetime').panDateTimePicker({
    'start_year':1990,
    'end_year':2030,
    'format':'mm/dd/yyyy'
});
*/
/*
$('#test_pansq').panScrollBar({'height':100})
*/
//颜色选择器
var panColorPickerObj = function(ele,data,fn){
    var self = this;
    var element = ele; //元素选择器
    var defaults = {
        'width':50,
        'height': 26,
        'borderColor':'#333',  //边框颜色
        'iconBorderColor':'#333', //图标边框颜色
        'iconColor':'#ff0000',  //图标默认显示的颜色
        'pickerLeft':-1,
        'pickerTop':25,
        'showBtn':true //是否显示选择器按钮 true,false
    };
    var settings = $.extend({},defaults,data);
    var canvasWidth = 180;
    var html = '';
    html += '<div class="picker_button"><div class="cur_color"></div><div class="arrow_btn"></div></div>';
    html += '<div class="picker_box">';
    html += '<div class="panel_box"><canvas class="color_canvas" width="'+canvasWidth+'" height="'+canvasWidth+'"></canvas>';
    html += '<div class="canvas_point"></div>';
    html += '<div class="rainbow_panel"><span></span></div></div>';
    html += '<div class="op_box"><div class="pre_color"></div><div class="now_color"></div>';
    html += '<div class="rgb_value">255,0,0</div><div class="hex_value">#ff0000</div>';
    html += '<div class="cancel_btn">取消</div><div class="ok_btn">确定</div></div>';
    html += '</div>';
    element.append(html);
    var $picker_button = element.find('.picker_button');
    var $picker_box = element.find('.picker_box');
    var $arrow_btn = element.find('.arrow_btn');
    var $colorCanvas = element.find('.color_canvas');
    var $colorSpan = element.find('.canvas_point');
    var $rainbowPanel = element.find('.rainbow_panel');
    var $rainbowSpan = element.find('.rainbow_panel').find('span');
    var $rgb_value = element.find('.rgb_value');
    var $hex_value = element.find('.hex_value');
    var $cur_color = element.find('.cur_color');
    var $pre_color = element.find('.pre_color');
    var $now_color = element.find('.now_color');
    var $ok_btn = element.find('.ok_btn');
    var $cancel_btn = element.find('.cancel_btn');
    //配置样式
    var pbDiaplay = 'block';
    if(settings.showBtn == false) {pbDiaplay = 'none';}
    $picker_button.css({
        'border-color':settings.borderColor,
        'width':settings.width + 'px',
        'height':settings.height + 'px',
        'display':pbDiaplay
    });
    $picker_box.css({
        'left':settings.pickerLeft+'px',
        'top':settings.pickerTop+'px',
        'display':'none'
    });
    $cur_color.css({
        'background-color':settings.iconColor,
        'height': (settings.height - 6) + 'px',
        'border-color':settings.iconBorderColor
    });
    $pre_color.css('background-color',settings.iconColor);
    //@red : rgb(255,0,0);
    //@orange : rgb(255,128,0);
    //@yellow : rgb(255,255,0);
    //green : rgb(0,255,0);
    //@blue : rgb(0,255,255);
    //@indigo : rgb(0,0,255);
    //@violet : rgb(128,0,255);
    var color_list = ['#ff0000','#FF8000','#ffff00','#00ff00','#00ffff','#0000ff','#8000ff'];
    var color_sets = [];
    var colorNum = 0;
    for(var idx=1;idx<7;idx++){
        gradient_list = gradientColor(color_list[idx-1],color_list[idx],30);
        $.merge(color_sets,gradient_list,false);
    }
    colorNum = color_sets.length;

    var rainbowPanelHeight = canvasWidth;
    var endY = 0;
    var endX = 0;
    var endY7 = 0;
    var selectPointColor = {'r':0,'g':0,'b':0};
    var mainColor = {'r':255,'g':0,'b':0};

    //获取画布2d数据对象
    var ctx=$colorCanvas[0].getContext("2d");
    var imgData=ctx.createImageData(canvasWidth,canvasWidth);
    updateCanvas({'r':255,'g':255,'b':255},mainColor,{'r':0,'g':0,'b':0},180);

    ColorCanvasEvent();
    rainbowEvent();
    $ok_btn.on('click',function () {
        if(typeof fn === 'function'){
            data = {
                'hex':$hex_value.html(),
                'rgb':selectPointColor
            }
            fn(data);
            $picker_box.css({'display':'none'});
            $cur_color.css('background-color',$hex_value.html());
            $pre_color.css('background-color',$hex_value.html());
        }
    });
    $cancel_btn.on('click',function () {
        $picker_box.css({'display':'none'});
    });
    $cur_color.click(function(){
        $picker_box.css({'display':'block'});
    });
    $arrow_btn.click(function(){
        $cur_color.click();
    });

    //public
    self.showPicker = function(){
        $picker_box.css({'display':'block'});
    }
    self.hidePicker = function(){
        $picker_box.css({'display':'none'});
    }

    //三色面板滑块
    function ColorCanvasEvent(){
        $colorSpan.on('mousedown',function(event){
            $colorCanvas.mousedown();
        })
        $colorCanvas.on('mousedown',function (event) {
            endX = event.pageX - $colorCanvas.offset().left;
            endY = event.pageY - $colorCanvas.offset().top;
            $colorSpan.css({'top':endY+'px', 'left':endX+'px'});
            document.onmousemove = onColorMouseMove;
            document.onmouseup = onColorMouseUp;
            document.onselectstart = function () { return false; }
            updateCanvasParams(endX,endY);
        })
        function onColorMouseMove(event) {
            endX = event.pageX - $colorCanvas.offset().left;
            endY = event.pageY - $colorCanvas.offset().top;
            endX = endX < 0 ? 0 : endX;
            endY = endY < 0 ? 0 : endY;
            var spanX  = endX > canvasWidth-3 ? canvasWidth-3 : endX-2;
            var spanY = endY > canvasWidth-3 ? canvasWidth-3 : endY-2;
            endX = endX > canvasWidth ? canvasWidth : endX;
            endY = endY > canvasWidth ? canvasWidth : endY;
            $colorSpan.css({'top':spanY+'px', 'left':spanX+'px'});
            updateCanvasParams(endX,endY);
        }
        function onColorMouseUp(event){
            document.onmousemove = null;
            document.onmouseup = null;
            document.onselectstart = null;
        }
    }
    //七彩面板滑块
    function rainbowEvent(){
        $rainbowSpan.on('mousedown',function(event){
            $rainbowPanel.mousedown();
        })
        $rainbowPanel.on('mousedown',function(event){
            endY7 = event.pageY - $colorCanvas.offset().top;
            endY7 = endY7 < 0 ? 0 : endY7;
            endY7 = endY7 > rainbowPanelHeight-4 ? rainbowPanelHeight-4 : endY7;
            document.onmousemove = onRainBowMouseMove;
            document.onmouseup = onRainBowMouseUp;
            document.onselectstart = function () { return false; }
            $rainbowSpan.css('top',endY7+'px');
            updateRainbowParams(endY7);
            updateCanvasParams(endX,endY);
        })
        function onRainBowMouseMove(event) {
            endY7 = event.pageY - $colorCanvas.offset().top;
            endY7 = endY7 < 0 ? 0 : endY7;
            endY7 = endY7 > rainbowPanelHeight-4 ? rainbowPanelHeight-4 : endY7;
            $rainbowSpan.css('top',endY7+'px');
            updateRainbowParams(endY7);
            updateCanvasParams(endX,endY);
        }
        function onRainBowMouseUp(event){
            document.onmousemove = null;
            document.onmouseup = null;
            document.onselectstart = null;
        }
    }
    function updateRainbowParams(y){
        if(isNaN(y))return;
        var colorId = parseInt(y*1.0/rainbowPanelHeight*colorNum);
        colorId = colorId < 0 ? 0 :colorId;
        colorId = colorId > colorNum-1 ? colorNum-1 :colorId;

        mainColor = color_sets[colorId];
        updateCanvas({'r':255,'g':255,'b':255},mainColor,{'r':0,'g':0,'b':0},canvasWidth);
    }
    function updateCanvasParams(x,y)
    {
        if(isNaN(y) || isNaN(x))return;
        var p = getCanvasPoints({'r':255,'g':255,'b':255},mainColor,{'r':0,'g':0,'b':0},canvasWidth,endX,endY);
        selectPointColor = p;
        $rgb_value.html(p.r+','+p.g+','+p.b);
        $now_color.css('background-color',rgbToHex2(p.r, p.g, p.b));
        //$cur_color.css('background-color',rgbToHex2(p.r, p.g, p.b));
        $hex_value.html(rgbToHex2(p.r, p.g, p.b));
    }
    //更新像素吸取点
    function updateCanvas(ltColor,rtColor,bColor,cWidth){
        var row_arr = [];
        var avgR = (rtColor.r-ltColor.r)*1.0/cWidth;
        var avgG = (rtColor.g-ltColor.g)*1.0/cWidth;
        var avgB = (rtColor.b-ltColor.b)*1.0/cWidth;
        for(var i=0;i<cWidth;i++)
        {
            row_arr.push({
                'r':parseInt(ltColor.r + avgR*i),
                'g':parseInt(ltColor.g + avgG*i),
                'b':parseInt(ltColor.b + avgB*i)
            })
        }
        for(var i=0;i<cWidth;i++)
        {
            for(var j=0;j<cWidth;j++)
            {
                var x = i*4*cWidth + j*4;
                imgData.data[x] = parseInt((bColor.r - row_arr[j].r)*1.0/cWidth*i+row_arr[j].r);
                imgData.data[x+1] = parseInt((bColor.g - row_arr[j].g)*1.0/cWidth*i+row_arr[j].g);
                imgData.data[x+2] = parseInt((bColor.b - row_arr[j].b)*1.0/cWidth*i+row_arr[j].b);
                imgData.data[x+3]= 255;
            }
        }
        ctx.putImageData(imgData,0,0);
    }
    function getCanvasPoints(ltColor,rtColor,bColor,cWidth,left,top){
        var avgR = parseInt((rtColor.r-ltColor.r)*1.0/cWidth * left + ltColor.r);
        var avgG = parseInt((rtColor.g-ltColor.g)*1.0/cWidth * left + ltColor.g);
        var avgB = parseInt((rtColor.b-ltColor.b)*1.0/cWidth * left + ltColor.b);
        var resR = parseInt((bColor.r - avgR)*1.0/cWidth*top+avgR);
        var resG = parseInt((bColor.g - avgG)*1.0/cWidth*top+avgG);
        var resB = parseInt((bColor.b - avgB)*1.0/cWidth*top+avgB);
        resR = resR > 255 ? 255 : resR;
        resG = resG > 255 ? 255 : resG;
        resB = resB > 255 ? 255 : resB;
        resR = resR < 0 ? 0 : resR;
        resG = resG < 0 ? 0 : resG;
        resB = resB < 0 ? 0 : resB;
        return {'r':resR,'g':resG,'b':resB};
    }

    //--------------------------------------
    function hexToRgb(mColor){
        //16进制转rgb,#ff00ff to rgb(r,g,b)
        var rgb = [];
        rgb.push(parseInt(mColor.substr(1,2),16));
        rgb.push(parseInt(mColor.substr(3,2),16));
        rgb.push(parseInt(mColor.substr(5,2),16));
        return rgb;
    }
    function rgbToHex(mColor){
        var rgb = mColor.split(',');
        var r = parseInt(rgb[0].split('(')[1]);
        var g = parseInt(rgb[1]);
        var b = parseInt(rgb[2].split(')')[0]);
        var hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        return hex;
    }
    function rgbToHex2(mR,mG,mB){
        var hR = mR.toString(16);
        var hG = mG.toString(16);
        var hB = mB.toString(16);
        hR = (hR.length == 1 ? '0'+hR : hR);
        hG = (hG.length == 1 ? '0'+hG : hG);
        hB = (hB.length == 1 ? '0'+hB : hB);
        return '#'+hR + hG +hB;
    }
    function gradientColor(startColor,endColor,step,returnHex){
        //'#ffffff' '#000000'
        var start = hexToRgb(startColor);
        var end = hexToRgb(endColor);
        var argR = (end[0] - start[0])*1.0/step;
        var argG = (end[1] - start[1])*1.0/step;
        var argB = (end[2] - start[2])*1.0/step;
        var gradientArr = [];
        for(i=0;i<step;i++){
            var resR = parseInt(start[0]+argR*i);
            var resG = parseInt(start[1]+argG*i);
            var resB = parseInt(start[2]+argB*i);
            resR = resR > 255 ? 255 : resR;
            resG = resG > 255 ? 255 : resG;
            resB = resB > 255 ? 255 : resB;
            if(returnHex == true)
                gradientArr.push(rgbToHex2(resR,resG,resB));
            else
                gradientArr.push({'r':resR,'g':resG,'b':resB});
        }
        return gradientArr;
    }
}
$.fn.extend({
    panColorPicker:function(data,fn){
        return new panColorPickerObj(this,data,fn);
    }
})
/*
var pc = $('#test_color_picker').panColorPicker({},function(data){
    console.log(data);
})
*/
//pc.showPicker();
//富文本编辑器
var panEditFrameObj=function(ele,data,fn){
    var defaults = {
        'width':810,
        'height':500
    };
    var settings = $.extend({},defaults,data);
    var self = this;
    var $element = ele;
    var family_arr = ['宋体','黑体','新宋体','仿宋','楷体','幼圆','Consolas','Courier New','Arial','Georgia','Impact','New Roman'];
    var fontsize_arr = {
        '初号':'9',
        '一号':'8',
        '二号':'7',
        '三号':'6',
        '小三':'5',
        '四号':'4',
        '小四':'3',
        '五号':'2',
        '小五':'1',
    };
    //<iframe>标签不能动态加载，为了兼容FireFox浏览器
    var html = '<div class="tool">';
    html += '<div class="first_row"><select class="family"></select>';
    html += '<select class="fontsize"></select>';
    html += '<button class="bold" title="粗体">B</button>';
    html += '<button class="italic" title="斜体">I</button>';
    html += '<button class="text_left" title="左对齐" tabindex = "0"></button>';
    html += '<button class="text_center" title="居中对齐"></button>';
    html += '<button class="text_right" title="右对齐"></button>';
    html += '<button class="reply_left" title="撤销"></button>';
    html += '<button class="reply_right" title="恢复撤销"></button>';
    html += '<button class="indent" title="增加缩进"></button>';
    html += '<button class="outdent" title="减少缩进"></button>';
    html += '<button class="underline" title="下划线"></button>';
    html += '<button class="deleteline" title="删除线"></button>';
    html += '<button class="remove_format" title="清除格式"></button>';
    html += '<button class="code_format" title="代码格式化"></button>';
    html += '<button class="table" title="表格"></button>';
    html += '</div>';
    html += '<div class="second_row">'
    html += '<button class="foreColor" title="字体颜色"></button><div class="pan-color-picker" id="forePicker" style="position: absolute"></div>';
    html += '<button class="backColor" title="字体背景颜色"></button><div class="pan-color-picker" id="backPicker" style="position: absolute"></div>';
    html += '<button class="link" title="超链接"></button>';
    html += '<button class="preview" title="预览"></button>';
    html += '</div>';
    html += '</div>';
    settings.width = settings.width < 800 ? 800:settings.width;
    settings.height = settings.height < 400 ? 400:settings.height;
    $element.css({
        'width':'100%',
        'height':settings.height+'px'
    })
    var $iframe = $element.find('iframe');
    $iframe.before(html);
    $iframe.css({
        'height':(settings.height-100)+'px'
    })
    //$(this).append(html);
    //插入表格
    html = '<div class="table_dialog">';
    html += '<div class="dialog_header"><span class="dialog_title">插入表格</span><span class="dialog_close">×</span></div>';
    html += '<div class="table_content"><input type="text" class="table_rows" value="3"><span>行</span><input type="text" class="table_cols" value="3"><span>列</span></div>';
    html += '<div class="dialog_ok_btn">确定</div>'
    $element.append(html);
    //代码编辑框
    html = '<div class="code_dialog">';
    html += '<div class="dialog_header"><span class="dialog_title">插入代码</span><span class="dialog_close">×</span></div><textarea class="dialog_content" spellcheck="false"></textarea>';
    html += '<div class="dialog_ok_btn">确定</div>'
    $element.append(html);
    //插入超链接
    html = '<div class="link_dialog">';
    html += '<div class="dialog_header"><span class="dialog_title">插入超链接</span><span class="dialog_close">×</span></div>';
    html += '<div class="link_content"><span>链接名字:</span><input type="text" class="link_name"/><br/><span>链接Url:</span><input type="text" class="link_id"/></div>';
    html += '<div class="dialog_ok_btn">确定</div>'
    $element.append(html);

    //预览
    html = '<div class="previewGg"><div class="previewContent"></div></div>';
    $element.append(html);

    //抽取对象
    var $family = $element.find('.family');
    var $fontsize = $element.find('.fontsize');

    var $bold = $element.find('.bold');
    var $italic = $element.find('.italic');
    var $textLeft = $element.find('.text_left');
    var $textCenter = $element.find('.text_center');
    var $textRight = $element.find('.text_right');
    var $replyLeft = $element.find('.reply_left');
    var $replyRight = $element.find('.reply_right');
    var $indent = $element.find('.indent');
    var $outdent = $element.find('.outdent');
    var $underline = $element.find('.underline');
    var $deleteline = $element.find('.deleteline');
    var $removeFormat = $element.find('.remove_format');
    var $codeFormat = $element.find('.code_format');
    var $table = $element.find('.table');

    var $colorForeBtn = $element.find('.foreColor');
    var $colorBackBtn = $element.find('.backColor');
    var $colorForePicker = $element.find('#forePicker');
    var $colorBackPicker = $element.find('#backPicker');

    var $link = $element.find('.link');
    var $preview = $element.find('.preview');
    //insert code dialog
    var $codeDialog = $element.find('.code_dialog');
    var $codeContent = $codeDialog.find('.dialog_content');
    var $codeDialogClose = $codeDialog.find('.dialog_close');
    var $codeDialogOK = $codeDialog.find('.dialog_ok_btn');
    //insert link dialog
    var $linkDialog = $element.find('.link_dialog');
    var $linkName = $linkDialog.find('.link_name');
    var $linkId = $linkDialog.find('.link_id');
    var $linkDialogClose = $linkDialog.find('.dialog_close');
    var $linkDialogOK = $linkDialog.find('.dialog_ok_btn');

    //preview
    var $previewDialog = $element.find('.previewGg');
    var $previewContent = $element.find('.previewContent');

    //table
    var $tableDialog = $element.find('.table_dialog');
    var $tableRows = $tableDialog.find('.table_rows');
    var $tableCols = $tableDialog.find('.table_cols');
    var $tableDialogClose = $tableDialog.find('.dialog_close');
    var $tableDialogOK = $tableDialog.find('.dialog_ok_btn');

    console.log($colorForePicker.html());

    //实例化颜色选择器
    var forePicker = $colorForePicker.panColorPicker({'showBtn':false},function(data){
        ifwin.document.execCommand('ForeColor', false, data.hex);
        ifwin.focus();
    });
    var backPicker = $colorBackPicker.panColorPicker({'showBtn':false},function(data){
        ifwin.document.execCommand('BackColor', false, data.hex);
        ifwin.focus();
    });
    $colorForePicker.css({'left':'1px', 'top':'1px'});
    $colorBackPicker.css({'left':'39px', 'top':'1px'});

    //添加字体
    html = '';
    for(var i in family_arr){
        html += '<option value ="'+ family_arr[i] +'">'+ family_arr[i] +'</option>'
    }
    $family.html(html);
    //添加字号
    html = '';
    for(var key in fontsize_arr){
        html += '<option value ="'+ fontsize_arr[key] +'">'+ key +'</option>'
    }
    $fontsize.html(html);
    //获取iframe dom
    var ifwin = $iframe[0].contentWindow;
    var ifdom = $iframe[0].contentWindow.document;
    console.log(ifwin);
    ifdom.body.contentEditable = true;
    $(ifdom.body).attr('spellcheck','false');  //取消拼写检查
    ifdom.designMode = "on";
    ifwin.focus();
    //编辑字型：
    //设置选定的文本为粗体/正常
    self.getFrameBodyHtml = function () {
        return $(ifdom.body).html();
    }
    self.setFrameBodyHtml = function(mhtml){
        $(ifdom.body).html(mhtml);
        $(ifdom.body).append('<br/>');
    }
    Events();
    function Events() {

        $family.change(function () {
            ifwin.document.execCommand('FontName', false, $(this).val());
            ifwin.focus();
        });
        $fontsize.change(function () {
            ifwin.document.execCommand('FontSize', false, parseInt($(this).val()));
            ifwin.focus();
        });

        $bold.on('click', function () {
            ifwin.document.execCommand('Bold', false, null);
            ifwin.focus();
        })
        $italic.on('click', function () {
            ifwin.document.execCommand('Italic', false, null);
            ifwin.focus();
        })
        $textLeft.unbind('focus');
        $textLeft.on('click', function () {
            ifwin.document.execCommand('justifyLeft', false, null);
            ifwin.focus();
        })
        $textCenter.on('click', function () {
            ifwin.document.execCommand('justifyCenter', false, null);
            ifwin.focus();
        })
        $textRight.on('click', function () {
            ifwin.document.execCommand('justifyRight', false, null);
            ifwin.focus();
        })
        $replyLeft.on('click', function () {
            ifwin.document.execCommand('undo', false, null);
            ifwin.focus();
        })
        $replyRight.on('click', function () {
            ifwin.document.execCommand('redo', false, null);
            ifwin.focus();
        })
        $indent.on('click', function () {
            ifwin.document.execCommand('indent', false, null);
            ifwin.focus();
        })
        $outdent.on('click', function () {
            ifwin.document.execCommand('outdent', false, null);
            ifwin.focus();
        })
        $underline.on('click', function () {
            ifwin.document.execCommand('underline', false, null);
            ifwin.focus();
        })
        $deleteline.on('click', function () {
            ifwin.document.execCommand('strikeThrough', false, '1');
            ifwin.focus();
        })
        $removeFormat.on('click', function () {
            ifwin.document.execCommand('removeFormat', false, '1');
            ifwin.focus();
        })
        $codeFormat.on('click', function () {
            $codeContent.val('');
            $codeDialog.css('display', 'block');
        })
        $colorForeBtn.on('click', function () {
            forePicker.showPicker();
        })
        $colorBackBtn.on('click', function () {
            backPicker.showPicker();
        })
        $codeDialogClose.on('click', function () {
            $codeDialog.css('display', 'none');
        })
        $codeDialogOK.on('click', function () {
            $codeDialog.css('display', 'none');
            ifwin.focus();    //此处加上focus，兼容IE,插入代码之后找不到插入光标位置
            var range = ifwin.getSelection().getRangeAt(0);
            var frag = range.createContextualFragment(barCodeStyle($codeContent.val()));
            range.insertNode(frag);
            $(ifdom.body).append('<br/>'); //插入换行，兼容FireFox浏览器光标移动到下面
        })
        $table.on('click', function () {
            console.log('table.clok');
            $tableDialog.css('display','block');
        })
        $tableDialogClose.on('click',function () {
            $tableDialog.css('display','none');
        })
        $tableDialogOK.on('click',function () {
            $tableDialog.css('display','none');
            var mRows = parseInt($tableRows.val());
            var mCols = parseInt($tableCols.val());
            ifwin.focus();
            var range = ifwin.getSelection().getRangeAt(0);
            var frag = range.createContextualFragment('<br/>' + addTable(mRows, mCols, 'center'));
            range.insertNode(frag);
            $(ifdom.body).append('<br/>');
        })
        $link.on('click', function () {
            $linkDialog.css('display', 'block');
            $linkName.val('');$linkId.val('');
        })
        $linkDialogClose.on('click', function () {
            $linkDialog.css('display', 'none');
        })
        $linkDialogOK.on('click', function () {
            ifwin.focus();
            var range = ifwin.getSelection().getRangeAt(0);
            var frag = range.createContextualFragment(addLink($linkName.val(),$linkId.val()));
            range.insertNode(frag);
            $linkDialog.css('display', 'none');
        })
        $preview.on('click',function () {
            $previewDialog.css('display','block');
            $previewContent.html($(ifdom.body).html());
            $("html,body").css({overflow:"hidden"}); //禁用滚动条
        })
        $previewDialog.on('click',function(){
            $(this).css('display','none');
            $("html,body").css({overflow:"auto"});
        })
        $previewContent.on('click',function (event) {
            event.stopPropagation();
        })
    }
    //条形斑马栏样式
    function barCodeStyle(text){
        var rHtml = '<ol style="font-size: 13px;white-space: pre-wrap;font-family: Consolas;border: 1px solid #ddd" spellcheck="false">';
        var rowList = text.split('\n');
        for(var row=0;row<rowList.length;row++){
            if(row%2 == 1)
                rHtml += '<li style="height:20px;line-height:20px;background-color: #f8f8f8;border-left:2px solid #8DB02E;padding-left: 10px;">' + keyHighter(rowList[row]) + '</li>';
            else
                rHtml += '<li style="height:20px;line-height:20px;background-color: #ffffff;border-left:2px solid #8DB02E;padding-left: 10px;">' + keyHighter(rowList[row]) + '</li>';
        }
        rHtml += '</ol>';
        return rHtml;
    }
    //添加超链接
    function addLink(linkName,linkId){
        var url = '';
        if(typeof linkId === 'string' && (linkId.indexOf('https://')==-1 && linkId.indexOf('http://')==-1)){
            url += 'http://' + linkId;
        }
        var lHtml = '<a href="' + url +'" target="_blank" >'+linkName+'</a>';
        return lHtml;
    }
    //替换关键字的颜色
    function keyHighter(text){
        return text;
        //return text.replace('main','<span style="color:#8DB02E;">main</span>');
    }
    //添加表格 algin 'left' 'center' 'right'
    function addTable(rows,cols,algin){
        var htm = '';
        if(algin=='left')
            htm += '<ol><table style="width:800px;border:1px solid #aaa;" cellspacing="0">';
        else if(algin=='center'){
            htm += '<table style="width:800px;border:1px solid #aaa;" cellspacing="0">';
        }
        for(var r = 0 ;r < rows;r++)
        {
            if(r%2==0)
                htm += '<tr style="background-color: #f8f8f8">';
            else
                htm += '<tr style="background-color: #ffffff">';
            for(var c=0;c < cols;c++){
                if(c==0)
                    htm += '<td style="width:100px;height:30px;border-left:0px solid #d5d5d5;color:#666"></td>';
                else
                    htm += '<td style="width:100px;height:30px;border-left:1px solid #d5d5d5;color:#666"></td>';
            }
            htm += '</tr>';
        }
        htm += '</table></ol>';
        return htm;
    }
};
$.fn.extend({
    panEditFrame:function(data,fn){
        return new panEditFrameObj(this,data,fn);
    }
})

//弹出层插件
var panBlogsDialogObj = function(ele,options,fn){
    var self = this;
    var $element = ele;
    var defaults = {
        'width':500,
        'height':300,
        'top':150
    };
    var settings = $.extend({},defaults,options);
    var $content = $element.find('.pan-blogs-dialog-content');
    $content.on('click',function (event) {
        event.stopPropagation();
    })
    $element.click(function(){
        phideDialog();
    })

    this.showDialog = function(){

        $element.fadeIn(200);
        $content.css({
            'width':(settings.width+100)+'px',
            'height':(settings.height+100)+'px',
            'margin':(settings.top-50)+'px' + ' auto'
        });
        $content.animate({
            'width':settings.width+'px',
            'height':settings.height+'px',
            'margin':(settings.top)+'px' + ' auto'
        },200);

    }
    function phideDialog(){
        $element.fadeOut(300);
    }
    this.hideDialog = function(){
        phideDialog();
    }
}
$.fn.extend({
    panBlogsDialog:function(options,fn){
        return new panBlogsDialogObj(this,options,fn);
    }
})

var panRandomCodeObj = function(ele,options,fn){
    var self = ele;
    var defaults = {};
    var settings = $.extend({},defaults,options);
    var canvas = self[0];//document.getElementById('image_canvas');
    var width = canvas.width;
    var height = canvas.height;
    var ctx = canvas.getContext('2d');
    this.setDrawCode = function(code){
        drawPic(code);
    }
    this.clearDrawCode = function(){
        ctx.clearRect(0,0,width,height);
    }
    function drawPic(code){
        var fontsize = ['55px','30px','35px','40px','45px','50px','25px'];
        var fontfamily = ['Arial','Times New Roman','Georgia','Serif','Microsoft YaHei'];

        for(var i=0;i<8;i++){
            ctx.beginPath();
            ctx.strokeStyle= 'rgb('+random(0,255)+','+random(0,255)+','+random(0,255)+')';
            ctx.moveTo(random(0,width),random(0,height));
            ctx.lineTo(random(0,width),random(0,height));
            ctx.closePath();
            ctx.stroke();
        }
        for(var i=0;i<50;i++){
            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.strokeStyle= 'rgb('+random(0,255)+','+random(0,255)+','+random(0,255)+')';
            var x = random(0,width);
            var y = random(0,height);
            ctx.moveTo(x,y);
            ctx.lineTo(x+2,y+2);
            ctx.closePath();
            ctx.stroke();
        }
        for(var i=0;i<4;i++){
            var char = code.substr(i,1);
            var type = random(0,20);
            ctx.fillStyle = 'rgb('+random(0,255)+','+random(0,255)+','+random(0,255)+')';
            ctx.strokeStyle= 'rgb('+random(0,255)+','+random(0,255)+','+random(0,255)+')';
            ctx.font = 'bold ' + fontsize[random(0,6)] + ' '+fontfamily[random(0,5)];
            if(type%2==0){
                ctx.strokeText(char,i*36+13,50);
            }else{
                ctx.fillText(char,i*36+13,50);
            }
        }
    }
    function random(n,m){
        return Math.floor(Math.random()*(m-n)) + n;
    }
}
$.fn.extend({
    panRandomCode:function(options,fn){
        return new panRandomCodeObj(this,options,fn);
    }
})

var panPages = function(ele,options,fn){
    var $ele = ele;
    var defaults = {
        'cur_page':18,
        'total_page':20,
        'background_color':'#ff00ff',
        'color':'#fff',
        'border_color':'#ff00ff',
        'point_color':'#333'
    }
    var settings = $.extend({},defaults,options);
    $ele.append('<button class="first_page">首页</button>');

    $ele.append('<button class="pre_page">上一页</button>');

    var mini = 1;
    var maxi = settings.total_page;
    if(settings.cur_page - 4 >= 1 && settings.cur_page + 4 <= settings.total_page){
        mini = settings.cur_page - 4;
        maxi = settings.cur_page + 4;
    }
    else if(settings.cur_page - 4 >= 1 && settings.cur_page + 4 > settings.total_page){
        maxi = settings.total_page;
        mini = settings.total_page - 7;
    }
    else if(settings.cur_page - 4 < 1 && settings.cur_page + 4 <= settings.total_page){
        mini = 1;
        maxi = 8;
    }
    else{
        mini = 1;
        maxi = settings.total_page;
    }
    mini = mini < 1 ? 1 : mini;
    maxi = maxi > settings.total_page ? settings.total_page : maxi;


    for(var i=1;i<=settings.total_page;i++){
        $ele.append('<button class="'+i+'">'+i+'</button>');
        if(i==1){
            if(mini>2){
                $ele.append('<span class="pre_point">...</span>');
            }
        }
        if(i==settings.total_page-1){
            if(maxi<settings.total_page-1){
                $ele.append('<span class="next_point">...</span>');
            }
        }
        if(settings.cur_page == i){
            selectedStatus($ele.find('.'+i));
        }else{
            noSelectedStatus($ele.find('.'+i));
        }
        if(i<mini || i > maxi){
            $ele.find('.'+i).css('display','none');
        }
        if(i==1 || i==settings.total_page){
            $ele.find('.'+i).css('display','inline-block');
        }
    }
    $ele.append('<button class="next_page">下一页</button>');
    $ele.append('<button class="last_page">尾页</button>');

    noSelectedStatus($ele.find('.first_page'));
    noSelectedStatus($ele.find('.pre_page'));
    noSelectedStatus($ele.find('.next_page'));
    noSelectedStatus($ele.find('.last_page'));
    $ele.find('span').css({
        'color':settings.point_color
    });

    $ele.on('mouseleave','button',function(){
        if($(this).attr('class') == settings.cur_page.toString())
            return;
        noSelectedStatus($(this));
    })

    $ele.on('mouseenter','button',function(){
        selectedStatus($(this));
    })
    $ele.on('click','button',function(){
        if(typeof fn === 'function'){
            fn($(this).html());
        }
    })

    function noSelectedStatus(eid){
        eid.css({
            'background-color':settings.background_color,
            'color':settings.color,
            'border-color':settings.border_color
        });
    }
    function selectedStatus(eid){
        eid.css({
            'background-color':settings.color,
            'color':'#fff',
            'border-color':settings.border_color
        })
    }
}