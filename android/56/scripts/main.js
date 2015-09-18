$(document).ready(function(){
	touchEvents={};
	browserRedirect(touchEvents);
	var lang=getUrlParam('lang');
	switch(lang){
		case 'en-US':
		lang='en-US';
		break;
		case 'zh-CN':
		lang='zh-CN';
		break;
		default:
		lang='en-US';
		break;
	} 
		i18n.init({
        "lng": lang,
        "resStore": resources,
        "fallbackLng" : 'en'
   	 }, function (t) {
        $(document).i18n();
    	});   
      
    $("#back").bind(touchEvents.touchend,function () {
    	window.close();
    });
     $(".btn").bind(touchEvents.touchend,BtnSend);
     $(".scroll").bind(touchEvents.touchmove,scrollMove);
     $(".scroll").bind(touchEvents.touchend,scrollMoveEnd);
  $("#modal").modal({escapeClose: !1,clickClose: !1,showClose: !1});
   t = new Toast({
     			message:i18n.t("message")
 			});
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


var resources={
	"zh-CN":{
		"translation":{
			"Socket":"插座",
			"titleOne":"家庭智能产品和生活护理产品",
			"titleTwo":"专业制造商",
			"timingON":"定时 开",
			"timingOFF":"定时 关",
			"timeRemind":"时间拖至0为取消定时",
			"connecting":"拼命连接中...",
			"timingWord":"定时",
			"off":"OFF",
			"on":"ON",
			"shutDown":"关闭",
			"turnOn":"开启",
			"message":"指令已发送"
		}
	},
	"en-US":{
		"translation":{
			"Socket":"Socket",
			"titleOne":"Smart Household & Lifecare product",
			"titleTwo":"manufacturer",
			"timingON":"timing ON",
			"timingOFF":"timing OFF",
			"timeRemind":"Drag to 0 to cancle the fixed time",
			"timingWord":"timing",
			"connecting":"connecting...",
			"off":"OFF",
			"on":"ON",
			"shutDown":"OFF",
			"turnOn":"ON",
			"message":"指令已发送"
		}
	}
};
function setBtnState(a,b){
	var self=$("#liEles"+a),
	       btn=self.find(".btn"),
	       circleChange=self.find(".circleChange"),
	       btnSpan=self.find(".btnSpan");
	       if(b==1){
	       	 circleChange.attr("stroke-dasharray","1069 1069");
	       	 btnSpan.text("ON");
	       	 btn.attr("data-state","1")
	       }else if(b==2){
	       	 circleChange.attr("stroke-dasharray","0 1069");
	       	 btnSpan.text("OFF");
	       	  btn.attr("data-state","0")
	       }
	      
}
// function powerPress(){
// 	$(this).addClass("press");
// }
function BtnSend(){
	var self=$(this),
	       idNum=self.attr("data-id"),
	       state=self.attr("data-state")-0,
	       i=state==0?"01":"02",
	       data="01"+i+"00"+idNum+"00",
	    frame=UARTDATA.encode(0x02,data);
	console.log("set_power      :"+frame.replace(/(\w{2})/g,'$1 ').replace(/\s*$/,''))
		self.removeClass("press");
		 var code ='(@devcall "{tid}" (uartdata "{args}") (lambda (x) x))'
			.replace('{tid}',tid)
			.replace('{args}',frame);
		ws.send(code);
		t.show();
}

function powerSend(){
	var self=$(this),
		dt=self.attr("data")-0,
		i=dt==0?1:2,
		data="010"+i+"00000000000000",
	    frame=UARTDATA.encode(0x02,data);
	console.log("set_power      :"+frame.replace(/(\w{2})/g,'$1 ').replace(/\s*$/,''))
		self.removeClass("press");
		 var code ='(@devcall "{tid}" (uartdata "{args}") (lambda (x) x))'
			.replace('{tid}',tid)
			.replace('{args}',frame);
		ws.send(code);
		t.show();
}

function numTransformate(value){
	if(typeof(value)=="number"){
		value = UARTDATA.hex2str(value);
	}else{
		value = parseInt(value,10);
		value = UARTDATA.hex2str(value);
	}
	return value;
} 
function scrollMoveEnd(event){
	event=event||window.event;
	var self=$(this),
	endPosX=event.originalEvent.changedTouches[0].clientX||event.clientX,
	deltaX=endPosX-startPOSX,
	absDelta=Math.abs(deltaX);
	self.attr("data",0);
	if(absDelta<30){return;};
	if(deltaX>0){
		self.removeClass("goingLeft");
	}else if(deltaX<0){
		self.addClass("goingLeft");
	}
}

function scrollMove(event){
	event=event||window.event;
	var self=$(this),
	       dt=self.attr("data")-0;
	       if(dt==1){return;};
	       startPOSX=event.originalEvent.changedTouches[0].clientX||event.clientX;
	       self.attr("data",1);
}
function showSwitch(){
	
}
var showSwitch=(function(e){
	var times=0;
	return function(e){
		var i=null;
		if(e==undefined||times==1){return;};
		for (i=1;i<=e;i++){
			$("#liEles"+i).css("display","block");
		}
		times=1;
	}
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
		msgEntity.hide();
	},

	show :function(){
		msgEntity.stop(true);
		msgEntity.fadeIn(this.time/2);
		var left = msgEntity[0].clientWidth/2 ;
		msgEntity.css("margin","0 0 0 -"+left+"px");
		msgEntity.fadeOut(this.time/2);
	}
}


var startPOSX=null;
  



var tid  = getUrlParam("tid") || "VDEV_1AFE349C3DJS";
var host = getUrlParam("host") || "device.hekr.me";

var token =getUrlParam("access_key")  || "azBBaDZpaUNCbjRKUlkxK29IR2dTVy9XblRQQ1JCOVpIU1RFR0IyZzBMazNWQzRnOW5DR3E4cVVIc2FxQmZYMzBu";

var user="APP_"+ Math.random().toString(36).substr(2)
var url  = "ws://"+host+":8080/websocket/t/"+user+"/code/"+token+"/user";
var ws   = new ReconnectingWebSocket(url);


ws.onmessage=function(e){
	console.debug("[WEBSOCKET] "+e.data);
	SEXP.exec(e.data);
};

ws.onerror=function(){
	
	console.error("[WEBSOCKET] connection error");
};
 
ws.onopen=function(){
	console.debug("[WEBSOCKET] connection opened");
	 var data="000000000000000000",
	    frame=UARTDATA.encode(0x02,data); 
	var code ='(@devcall "{tid}" (uartdata "{args}") (lambda (x) x))'
			.replace('{tid}',tid)
			.replace('{args}',frame);
		setTimeout(function(){
			 ws.send(code);
			},500);	
   console.debug(code);
	$.modal.close();
};
ws.onclose=function(){
	console.error("[WEBSOCKET] connection closed");
};

window.changestate=function(e){
	
console.debug("[STATE] ================");
     console.debug(e); 
     console.debug("[STATE] ================");
    if(e.tid===tid){
     	var mes=UARTDATA.decode(e.uartdata);
     		console.debug(mes);
     		if(mes[0]==1){
     			setBtnState(mes[3],mes[1]);
     		}else if(mes[0]==0){
     			setBtnState(mes[3],mes[1]);
     			showSwitch(mes[2]);
     		}
     		
     	}	
};

