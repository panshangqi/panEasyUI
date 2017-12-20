//鼠标滚轮事件 chrome firefox >=ie8
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
            'barWidth':5,
            'barColor':'#ddd',
            'thumbColor':'#aaa'
        };

        var settings = $.extend({},defaults,data);
        var dom = $(this).html();
        console.log(dom);
        var html = '<div class="scroll-content"></div>';
        html += '<div class="scroll-bar"><div class="scrollbar-thumb"></div></div>';
        $(this).html(html);
        var $content = $(this).find('.scroll-content');
        var $bar = $(this).find('.scroll-bar');
        var $thumb = $bar.find('.scrollbar-thumb');
        $content.html(dom);

        $(this).css({
            'width':settings.width + 'px',
            'height':settings.height + 'px',
            'overflow':'hidden'
        });
        $content.css({

        });
        $bar.css({
            'height':settings.height + 'px',
            'width':settings.barWidth + 'px',
            'left':(settings.width-settings.barWidth)+'px',
            'background-color':settings.barColor
        });
        //滚轮事件以及鼠标事件
        var contentTop = 0;
        var contentDis = $(this).height() - $content.height() + 1;
        var rate = settings.height*1.0/$content.height();
        var thumbHeight = parseInt(rate*settings.height);
        var thumbTop = 0;
        var thumbDis = settings.height - thumbHeight;

        $thumb.css({
            'height':thumbHeight + 'px',
            'background-color':settings.thumbColor
        })
        if($content.height() <= settings.height)
        {
            $bar.css('display','none');
            return;
        }
        //------------------鼠标滑轮------------------
        var moveThead = null;
        var speed = 1;
        var interVal = 2;
        var contentTopStop = 0;
        var thumbVal = -(thumbDis*interVal*1.0/contentDis);
        var thumbValP = thumbVal;
        //console.log(thumbDis+'/'+contentDis+'='+thumbVal);

        $(this).onMouseWheel(function(e,detail){
            if(moveThead)
                clearInterval(moveThead);
            if(detail > 0){ //上滚
                interVal = 2;
                contentTopStop = contentTop + 250;
                if(contentTop >= -1)
                    return;
                if(contentTopStop > -1)
                    contentTopStop = -1;
                speed = 1;
                thumbValP = -thumbVal;
                moveThead=setInterval(SmoothMoveThread,speed);
            }
            else{
                interVal = -2;
                contentTopStop = contentTop - 250;
                if(contentTop <= contentDis)
                    return;
                if(contentTopStop < contentDis)
                    contentTopStop = contentDis;
                speed = 1;
                thumbValP = thumbVal;
                moveThead=setInterval(SmoothMoveThread,speed);
            }
        });

        //------------------鼠标拖动滚动条-------------------
        var thumb_start_y = 0;
        var thumb_cur_y = 0;
        $thumb.on('mousedown',function (evt) {
            thumb_start_y = evt.pageX;
            console.log(thumb_start_y);
        })
        $thumb.on('mousemove',function (evt) {
            thumb_cur_y = evt.pageY;
            console.log(thumb_cur_y - thumb_start_y);
        })

        function SmoothMoveThread(){
            contentTop += interVal;
            thumbTop += thumbValP;
            if(interVal > 0 && contentTop > contentTopStop)
                clearInterval(moveThead);
            else if(interVal < 0 && contentTop < contentTopStop)
                clearInterval(moveThead);
            $content.css({'margin-top': contentTop + 'px'});
            $thumb.css({'margin-top': thumbTop + 'px'});
        }

    }
});
$('#test_scroll').panScrollBar({'width':600});
//下拉框选择器
$.fn.extend({
    selectorInit:function(data,fn){
        var defaults = {
            'width':280,
            'expandType': 'touch',  //下拉框触发模式 'touch' 'click'
            'optionsULHeight':200,
            'text':{'tId':'demo','tName':'demo'},
            'options':[{'tId':'demo','tName':'demo'},
                {'tId':'demo','tName':'demo'},
                {'tId':'demo','tName':'demo'},
                {'tId':'demo','tName':'demo'}]
        }
        var settings = $.extend({},defaults,data);
        var html = '';
        //初始化默认选择项
        html += '<div class="pan-text" tId="'+settings.text.tId+'">';
        html += settings.text.tName;
        html += '</div>';
        html += '<div class="pan-btn"><span></span></div>';

        html += '<div class="pan-select-ul">';
        html += '<div class="pan-scroll-box"><ul>';
        //加载列表项
        for(var i in settings.options){
            html += '<li tId="'+settings.options[i].tId+'">';
            html += settings.options[i].tName + '</li>';
        }
        html += '</ul></div></div>';
        $(this).html(html);
        var self = $(this);
        //初始化自定义列表框
        $(this).css('width',settings.width + 'px');
        self.find('.pan-text').css({
            'width':(settings.width-36) + 'px'
        });
        var $panScrollUl = $(this).find('.pan-select-ul');
        var $panScrollBox = $(this).find('.pan-scroll-box');
        $panScrollBox.panScrollBar({
            'width':settings.width,
            'height':settings.optionsULHeight
        });
        $panScrollBox.find('ul').css({
            'width':settings.width+'px'
        })
        var ULHeight = $panScrollBox.find('ul').height();
        if(ULHeight < settings.optionsULHeight)
            settings.optionsULHeight = ULHeight;
        console.log('ul-->' + $panScrollBox.find('ul').height());
        $panScrollUl.css({
            'width':settings.width+'px',
            'height':settings.optionsULHeight + 'px',
            'display':'none'
        })


        //Event
        if(settings.expandType == 'click'){
            self.on('click',function(){
                $panScrollUl.css('display','block');
            })
        }
        else if(settings.expandType == 'touch') {
            self.on('mouseenter', function () {
                $panScrollUl.css('display','block');
            })
        }
        self.on('mouseleave',function () {
            $panScrollUl.css('display','none');
        })
        self.on('click','ul li',function(){
            self.find('.pan-text').html($(this).html());
            self.find('.pan-text').attr('tId',$(this).attr('tId'));
            $panScrollUl.css('display','none');
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
        console.log(JSON.stringify(settings));
        var now = new Date();
        var mYear = now.getFullYear();
        var mMonth = now.getMonth() + 1;
        var mDay = now.getDate();
        $(this).html('<label class="date-show"></label>');
        $(this).append('<div class="picker-box"></div>');
        var html = '<div class="picker-header">';
        html += '<div class="left-btn"></div>';
        html += '<div class="year-selector">';
        html += '<a class="year-text">2017</a>';
        html += '<span class="year-btn"></span>';
        html += '<ul class="year-list"></ul>';
        html += '</div>';
        html += '<div class="month-selector">';
        html += '<a class="month-text">09</a>';
        html += '<span class="month-btn"></span>';
        html += '<ul class="month-list"></ul>';
        html += '</div>'
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
        for(var i=settings.start_year;i<=settings.end_year;i++){
            html += '<li>'+i+'</li>';
        }
        $(this).find('ul.year-list').html(html);
        html = '';
        for(var i=1;i<=12;i++){
            html += '<li>'+i+'</li>';
        }
        $(this).find('ul.month-list').html(html);
        var $self = $(this);
        //init days
        updateMonths(mYear,mMonth);

        $(this).find('.year-selector').on('mouseenter',function(){
            $self.find('.year-list').css('display','block');
        })
        $(this).find('.year-selector').on('mouseleave',function () {
            $self.find('.year-list').css('display','none');
        })
        $(this).find('.year-list').on('click','li',function(){
            var curYear = $(this).html();
            var curMonth = $self.find('.month-text').html();
            $self.find('.year-text').html(curYear);
            $self.find('.year-list').css('display','none');
            updateMonths(parseInt(curYear),parseInt(curMonth));
        })
        $(this).find('.month-selector').on('mouseenter',function(){
            $self.find('.month-list').css('display','block');
        })

        $(this).find('.month-selector').on('mouseleave',function () {
            $self.find('.month-list').css('display','none');
        })
        $(this).find('.month-list').on('click','li',function(){
            var curYear = $self.find('.year-text').html();
            var curMonth = $(this).html();
            $self.find('.month-text').html(curMonth);
            $self.find('.month-list').css('display','none');
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
    'end_year':2025,
    'format':'mm/dd/yyyy'
});


