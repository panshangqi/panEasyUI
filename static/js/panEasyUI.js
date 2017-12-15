$.fn.extend({
    selectorInit:function(data,fn){
        var html = '';
        if(data.text && typeof data.text === 'object'){
            html += '<div class="pan-text" tId="'+data.text.tId+'">';
            html += data.text.tName;
            html += '</div>';
        }
        html += '<div class="pan-btn"><span></span></div>';
        html += '<ul>';
        if(data.options && typeof data.options === 'object'){
            for(var i in data.options){
                html += '<li tId="'+data.options[i].tId+'">';
                html += data.options[i].tName + '</li>';
            }
        }
        html += '</ul>';
        $(this).html(html);
        var self = $(this);

        //width and height
        if(data.width && typeof data.width === 'number'){
            $(this).css('width',data.width + 'px');
            self.find('.pan-text').css({
                'width':(data.width-36) + 'px'
            });
            self.find('ul').css({
                'width':data.width + 'px'
            });
        }
        if(data.height && typeof data.height === 'number'){
            $(this).css('height',data.height + 'px');
            self.find('.pan-text').css({
                'height':data.height + 'px',
                'line-height':data.height + 'px'
            });
            self.find('.pan-btn').css({
                'height':data.height + 'px',
            });
        }

        self.on('mouseenter',function(){
            $(this).find('ul').css('display','block');
        })
        self.on('mouseleave',function () {
            $(this).find('ul').css('display','none');
        })
        self.on('click','ul li',function(){
            self.find('.pan-text').html($(this).html());
            self.find('.pan-text').attr('tId',$(this).attr('tId'));
            self.find('ul').css('display','none');
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
        var months_arr1 = [31,29,31,30,31,30,31,31,30,31,30,31];
        var months_arr2 = [31,28,31,30,31,30,31,31,30,31,30,31];
        var week_arr_en = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
        var week_arr_ch = ['日','一','二','三','四','五','六'];

        $(this).html('<div class="picker-box"></div>');
        var html = '<div class="picker-header">';
        html += '<div class="left-btn"></div>';
        html += '<div class="year-text">2017</div>';
        html += '<div class="year-btn"></div>';
        html += '<div class="month-text">09</div>';
        html += '<div class="month-btn"></div>';
        html += '<div class="right-btn"></div>';
        html += '</div>';
        html += '<div class="picker-week">';
        for(var i=0;i<7;i++){
            html += '<span>'+week_arr_ch[i]+'</span>';
        }
        html += '</div>';
        html += '<div class="week_list"></div>';
        $(this).find('.picker-box').html(html);

        updateMonths(2017,12);
        function updateMonths(year,month){
            var leap_year = false;//闰年 = true
            if((year%400 == 0) || (year%4 == 0 && year%100 != 0)){
                leap_year = true;
            }
            var week_id = getWeek(year,month,1);
            for(var i=0;i<7;i++){

            }

        }
        getWeek(2010,1,7);
        function getWeek(year,month,day){
            var myDate = new Date(year+'-'+month+'-'+day);
            var week = myDate.getDay();
            console.log(week);
            return week;
        }
    }
});
$('#test_datetime').panDateTimePicker({

});


