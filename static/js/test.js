$.extend({
    min: function(a,b){
        return a<b?a:b;
    },
    max: function(a,b){
        return a>b?a:b;
    }
})
$.fn.extend({
    dialogClick:function(data){
        $(this).click(function(){
            if(typeof dialogYesClick === 'function'){
                dialogYesClick();
            }
        })
    }
})
$(document).ready(function () {
    var result = $.max(20,500);
    //alert(result);
    $('#a_btn').dialogClick();
})
function dialogYesClick(){
    alert('click');
}
function Apple(color,size){
    var color = color || 'no-color';
    var size = size || 120;
    console.log(color + ',' + size);
}
Apple('#fff');