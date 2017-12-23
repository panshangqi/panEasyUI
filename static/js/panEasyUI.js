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
$('#test_scroll').panScrollBar({'width':600,'scroll_y_overflow':'auto'});
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
$('#test_datetime').panDateTimePicker({
    'start_year':1990,
    'end_year':2030,
    'format':'mm/dd/yyyy'
});


$('#test_pansq').panScrollBar({'height':100})

