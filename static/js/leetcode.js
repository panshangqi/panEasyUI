var reverse = function(x) {
    var inmx = 1;
    for(var i=0;i<31;i++){
        inmx *=2;
    }
    console.log(inmx);
    var flag = 1;
    var s = x.toString();
    if(x<0)
    {
        flag = -1;
        s = s.substring(1,s.length);
    }


    var len = s.length;
    var temp = '';
    for(var i=len-1;i>=0;i--){
        temp += s[i];
    }
    var result = parseInt(temp);
    result = result > inmx ? 0 : result;
    if(result==0)
        return 0;
    else
        return result*flag;
};

var result = reverse(1563847412);
console.log(result);