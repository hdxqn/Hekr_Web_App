$(document).ready(function(){

	touchEvents={};
	browserRedirect(touchEvents);

    
    $('#view_scroll').bind('mousewheel',function(event,delta){
        scrollMain(delta);
    });
$(".turn_box").bind(touchEvents.touchend,flip);
$(".nav_radio").bind(touchEvents.touchend,radioClicked);
$("#category").find("li").bind(touchEvents.touchend,chooseCategory);
$("button").bind(touchEvents.touchend,PostMessage);

     document.getElementById('view_scroll').addEventListener("touchstart",function(event){
        startPos=event.touches[0].pageY;
    });
     document.getElementById('view_scroll').addEventListener("touchmove",function(event){
       event.preventDefault();
    });
      document.getElementById('view_scroll').addEventListener("touchend",function(event){
        var delta = event.changedTouches[0].pageY-startPos;
        if(delta>30){
            scrollMain(1);
            startPos=event.changedTouches[0].pageY;
        }else if(delta<-30){
            scrollMain(-1);
            startPos=event.changedTouches[0].pageY;
        }
    });
        mainOneAnimation();
  
})
function browserRedirect(obj) {
    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    var bIsMidp = sUserAgent.match(/midp/i) == "midp";
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    var bIsAndroid = sUserAgent.match(/android/i) == "android";
    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
         
    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
         obj.touchstart="touchstart";
            obj.touchmove= "touchmove";
            obj.touchend= "touchend";
         
    } else {
        
                obj.touchstart = "mousedown";
                obj.touchmove = "mousemove";
                obj.touchend = "mouseup";
         
    }
 }

 (function($){
        var Calendar = function(unit){
            this.unit = unit;
            this.topFont = unit.find(".top").eq(1);
            this.topBack = unit.find(".top").eq(0);
            this.btmFont = unit.find(".btm").eq(1);
            this.btmBack = unit.find(".btm").eq(0);
            this.text=null;
            this.val=null;
            this.timer=null;
            this.mtx = false;
            //默认的配置参数
            this.setting={
                "val":0, //日历初始数值
                "maxval":16, //日历数值最大值
                "minval":0 ,//日历数值最小值
                "interval":300 //日历翻页间隔时间
            }
            //扩展配置参数
            $.extend(this.setting,this.getSetting());
            this.setVal(this.setting.val);
            this.animateReset();
            this.starAnimation();
        };
        Calendar.prototype={
            getSetting:function(){
                var setting=this.unit.attr("data-setting");
                if(setting&&setting!=""){return $.parseJSON(setting);}
                else{return {};}
            },
            update:function(){
                this.updateNum();
                if(this.val>=this.setting.maxval) { this.setVal(this.setting.maxval);this.endAnimation();}
                if(this.val<=this.setting.minval) { this.setVal(this.setting.minval);this.endAnimation();}
            },
            updateNum:function(){
                if(this.val>9) {this.text = this.val;} 
                else {this.text = "0"+this.val;}
            },
            incVal:function(){
                this.val++;
                this.update();
            },
            decVal:function(){
                this.val--;
                this.updata();
            },
            setVal:function(v){
                this.val=v;
                this.updateNum();
            },
            transform:function(obj,tran){
                $(obj).css({
                    "-webkit-transform":tran,
                    "-moz-transform":tran,
                    "-o-transform":tran,
                    "-ms-transform":tran,
                    "transform":tran,
                });
            },
            animateReset:function(){
                var self = this;
                 this.transform(this.btmFont,"");
                 this.transform(this.btmBack,"");
    
                this.btmFont.find("span").text(self.text);
                this.topBack.find("span").text(self.text);
                this.topFont.find("span").text(self.text);
                this.btmBack.find("span").text(self.text);
    
                this.transform(this.topFont,"");
                this.transform(this.topBack,"");
            },
            turnDown:function(){
                var self = this;
                if(this.mtx){return;}
                this.incVal();
                var topDeg=0,
                    btmDeg=90;
                this.topBack.find("span").text(this.text);
                this.transform(this.topFont,"rotate3d(1,0,0,0deg)");
                var timer1=setInterval(function(){
                    self.transform(self.topFont,"rotate3d(1,0,0,"+topDeg+"deg)");
                    topDeg-=10;
                    if(topDeg<=-90){
                        self.transform(self.topFont,"rotate3d(1,0,0,0deg)");
                        self.topFont.find("span").text(self.text);
                        self.transform(self.btmFont,"rotate3d(1,0,0,90deg)");
                        self.btmFont.find("span").text(self.text);
                        var timer2=setInterval(function(){
                            if(btmDeg<=0){
                                clearInterval(timer2);
                                self.animateReset();
                                self.mtx=false;
                            }
                            self.transform(self.btmFont,"rotate3d(1,0,0,"+btmDeg+"deg)");
                            btmDeg-=10;
                        },30);
                        clearInterval(timer1);
                    }
                },30);
            },
            starAnimation:function(){
                var self=this;
                this.timer=setInterval(function(){
                    self.turnDown();
                },self.setting.interval)
            },
            endAnimation:function(){
                clearInterval(this.timer);
            }

        };
    Calendar.init=function(unit){
        var self=this;
        unit.each(function(){
            new self($(this));
        });
    };
    window["Calendar"]=Calendar;
})(jQuery);

function mainOneAnimation(){
    setTimeout(function(){
         Calendar.init($(".unit"));
    },700);
 }
 function flip(){
    var elef=null,
        eleb=null;
    $(this).find('img').each(function(){
        if ($(this).hasClass('out')) {
            eleb=$(this);
        }else{
            elef=$(this);
        }
    });

     $(elef).addClass("out").removeClass("in");
    setTimeout(function() {
        $(eleb).addClass("in").removeClass("out");
    }, 300);

 }
 function positionSet(ts) {
     var h=ts.clientHeight,
         w=ts.clientWidth;
         $(ts).css("margin","0 0 0 -"+w/2+"px");
 }
 var scrollMain = (function() {
     var currentPage=1,
        oldTime=new Date();
     return function(delta,num){
        var newTime=new Date(),
            time=newTime-oldTime;
        if(!delta){
            currentPage=num;
            return;
        }else if(delta<0&&time>1000){
            currentPage=currentPage>=7?currentPage:currentPage+1;
            $("#jump_main_"+currentPage).click();
            oldTime=newTime;
        }else if(delta>0&&time>1000){
            currentPage=currentPage<=1?currentPage:currentPage-1;
             $("#jump_main_"+currentPage).click();
             oldTime=newTime;
        }
     };
 })();
 function radioClicked(){
    var dt=$(this).attr("data"),
        num=dt-0,
        arg=false;
        scrollMain(arg,num);
 }
 function chooseCategory(){
    var str=$(this).text();
    $("#category").find("span").text(str);
    $("#categoryText").text(str);
 }
 function PostMessage(){
    event.preventDefault();
    
    var num=encodeURIComponent($("input[name=phoneNum]").val()),
        name=encodeURIComponent($("input[name=name]").val()),
        ct=encodeURIComponent($("input[name=category]").text()),
        url="http://www.hekr.me/savelog.php?category={{ct}}&tel={{num}}&name={{name}}",
        code=url.replace("{{ct}}",ct)
            .replace("{{num}}",num)
            .replace("{{name}}",name);
        $.get(code,function(data,status){
           var obj=$.parseJSON(data),
               img= $("#submitImg");
           if(obj.code==200){
           img.css("visibility","visible");
           }
           setTimeout(function(){
            img.css("visibility","hidden");
           },3500);
  });
 }
 var startPos=null;