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
      $("#power").bind(touchEvents.touchstart,powerPress);
    $("#power").bind(touchEvents.touchend,powerSend);
       $(".ctrlimg").bind(touchEvents.touchstart,powerPress);
         $(".ctrlimg").bind(touchEvents.touchend,messageSend);
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
function powerPress(){
	$(this).addClass("press");
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
function messageSend(){
	var self=$(this),
	      pos=self.data("pos")-0,
	      state=self.data("state")-0,
	      mes=self.data("mes"),
	      i=state==0?"01":"02",
	      arr=["00","00","00","00","00","00","00","00","00"],
	      data=null,
	      frame=null,
	      code=null;
	      arr[0]=mes;
	      arr[pos]=i;
	      data=arr.join("");
	      frame=UARTDATA.encode(0x02,data);
	      console.log("set_power      :"+frame.replace(/(\w{2})/g,'$1 ').replace(/\s*$/,''))
		self.removeClass("press");
		  code ='(@devcall "{tid}" (uartdata "{args}") (lambda (x) x))'
			.replace('{tid}',tid)
			.replace('{args}',frame);
		ws.send(code);
		t.show();
}
function setPowerState(e){
	var power=$("#power"),
	      str=power.attr("src"),
	      num=null;
	if(e==1){
		str=str.replace("off","on");
		num=1;
	}else if(e==2){
		str=str.replace("on","off");
		num=1;
	}
	power.attr({
		"src":str,
		"data":num
	});
}
function handleMes(e,arr){
	var a=null;
	if(e==1){
		return;
	}else if(e==0){
		 a=[2,3,4,5,6,7];
	}else{
		 a=[e];
	}
	setImgState(a,arr);
}
function setImgState(a,b){
	var acon=a instanceof Array,
	      bcon=b instanceof Array;
	if(!a||!b||!acon||!bcon){return;}
	for(var i=0;i<a.length;i++){
		var self=$("#img"+a[i]),
		       pos=self.data("pos")-0,
		       state=b[pos]==1?1:0,
		       src=self.attr("src");
		       if(b[pos]==1){
		       	src=src.replace("off","on");
		       	self.addClass("borderColor");
		       }else if(b[pos]==2){
		       	src=src.replace("on","off");
		       	self.removeClass("borderColor");
		       }
		       self.attr({
		       	"src":src,
		       	"data-state":state
		       });
	}
}
function setTemState(e){
	if(e==0){return;}
	$("#temNum").text(e);
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
     		if(mes[0]==0||mes[0]==1){
     		setPowerState(mes[1]);	
     		}
     		handleMes(mes[0],mes);
     		setTemState(mes[7]);
     	}	
};

