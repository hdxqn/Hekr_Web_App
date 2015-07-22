$(document).ready(function(){
	touchEvents={};
	browserRedirect(touchEvents);
	$("#direction img").bind(touchEvents.touchstart,press);
	$("#direction img").bind(touchEvents.touchend,release);
	$("#operate img").bind(touchEvents.touchstart,press);
	$("#operate img").bind(touchEvents.touchend,release);
	$(".btn").bind(touchEvents.touchstart,chooseMode);
    $(".m2").bind(touchEvents.touchstart,operatePress);
    $(".m2").bind(touchEvents.touchend,operateChoose);
});

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

 function operatePress(event){
     event=event||window.event;
    event.preventDefault();
    var src=$(this).attr("src"),
        newSrc=src.replace("B","A");
        $(this).attr("src",newSrc);

 }
 function operateChoose(event){
     event=event||window.event;
    event.preventDefault();
    var src=$(this).attr("src"),
        id=$(this).attr("id"),
        newSrc=src.replace("A","B");
        $(this).attr("src",newSrc);
        if(id=="canSend"){
            $("#show").find(".iconfont").remove();
            $(".m2").css("display","none");
            return;
        }else if(id=="conSend"){
            var eles=$("#show").find(".iconfont"),
                arr=[];
                if(eles.length<=0){return;}
                for(var i=0;i<eles.length;i++){
                    var str="0"+$(eles[i]).attr("data");
                    arr.push(str);
                }
                var command=arr.join("");
                 var frame=UARTDATA.encode(0x02,command);

         var code ='(@devcall "{tid}" (uartdata "{args}") (lambda (x) x))'
            .replace('{tid}',tid)
            .replace('{args}',frame);
            console.debug(code);
            ws.send(code);
             $("#show").find(".iconfont").remove();
             $(".m2").css("display","none");
        }


 }

 function press(event){
    event=event||window.event;
    event.preventDefault();
 	var src=$(this).attr("src"),
        dt="0"+$(this).attr("data"),
 		newSrc=src.replace("B","A");
 		$(this).attr("src",newSrc);
        if(mode==2){return;}

    var frame=UARTDATA.encode(0x02,dt);

         var code ='(@devcall "{tid}" (uartdata "{args}") (lambda (x) x))'
            .replace('{tid}',tid)
            .replace('{args}',frame);
            console.debug(code);
        sendMes(code,1);
 }
 function release(){
 	var src=$(this).attr("src"),
        dt=$(this).attr("data"),
 		newSrc=src.replace("A","B");
 		$(this).attr("src",newSrc);
         sendMes(src,0);
        if(mode==1){
            return;
        }else if(mode==2){
            console.log(dt);
            appendContent(dt);
        }
 }
 function chooseMode(){
 	$(".btn").attr("src","images/Btn.png");
 	$(this).attr("src","images/Atn.png");
 	var id=$(this).attr("id");
 	if(id=="m1"){
 		mode=1;
        $(".m2").css("display","none");
 	}else if(id=="m2"){
 		mode=2;
        $(".m2").css("display","block");
 	}
    console.log(id+"   "+mode);
 }

function sendMes(mes,bh){
    if(bh==1){
        clearInterval(timer);
         timer = setInterval(function(){
            ws.send(mes);
            console.debug(mes);
        },1000);
    }else if(bh==0){
        clearInterval(timer);
    }
}

var mode=1;
var timer=null;
var appendContent = (function(){

    var htmlstr="<i class=\"iconfont\" data={{num}}>{{text}}</i>";
    var eles= document.createElement("i");
    eles.className="iconfont";
    return function(num){
        var str=null;
        switch(num){
            case "1":
            str="&#xe70c;";
            break;
            case "2":
            str="&#xe701;";
            break;
            case "3":
            str="&#xe700;";
            break;
            case "4":
            str="&#xe70b;";
            break;
            case "5":
            str="抬";
            break;
            case "6":
            str="落";
            break;
            case "7":
            str="左";
            break;
            case "8":
            str="右";
            break;
            default:
            break;
        }
        var newcode=htmlstr.replace("{{text}}",str)
                            .replace("{{num}}",num);
        $("#show").append(newcode);
        console.log(newcode);
    };
})();

function getUrlParam(name) {
     var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if (r != null) return unescape(r[2]);
     return null;
 }



var Toast = function(config){
    this.context = config.context || $('body');
    this.message =config.message;
    this.time = config.time || 3000;
    this.init();
}

var msgEntity;
Toast.prototype = {

    init :function(){
        $("#toastMessage").remove();

        var msgDIV = new Array();
        msgDIV.push('<div id="toastMessage">');
        msgDIV.push('<span>'+this.message+'</span>');
        msgDIV.push('</div>');
        msgEntity = $(msgDIV.join('')).appendTo(this.context);

        var left =  this.context.width()/2-msgEntity.find('span').width()/2 ;

        var bottom = '20px' ;
        msgEntity.css({
            position:'fixed',
            bottom:bottom,
            'z-index':'99',
            left:left,
            'background-color':'#000000',
            color:'white',
            'font-size':'14px',
            padding:'5px',
            margin:'0px',
            'border-radius':'2px'
        });
        msgEntity.hide();
    },

    show :function(){
        msgEntity.stop(true);
        msgEntity.fadeIn(this.time/2);
        msgEntity.fadeOut(this.time/2);
        
    }
}

  



var tid  = getUrlParam("tid");
var host = getUrlParam("host") || "device.hekr.me";

var token =getUrlParam("access_key") ;

var user = Math.floor(Math.random()*100);
var url  = "ws://"+host+":8080/websocket/t/"+user+"/code/"+token+"/user";
var ws   = new ReconnectingWebSocket(url);
var startPosY=null;

ws.onmessage=function(e){
    console.debug("[WEBSOCKET] "+e.data);
    SEXP.exec(e.data);
};

ws.onerror=function(){
    setTimeout(function(){
         ws.send('(get-state "{tid}")'.replace("{tid}", tid));
     },100)
    console.error("[WEBSOCKET] connection error");
};

ws.onopen=function(){
    console.debug("[CONNECTED]");
};
ws.onclose=function(){
    console.error("[WEBSOCKET] connection closed");
};

window.changestate=function(e){
    console.debug("[STATE] ================");
     console.debug(e); 
     console.debug("[STATE] ================");
     console.debug(e.uartdata);
    
};



