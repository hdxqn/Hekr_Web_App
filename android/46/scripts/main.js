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
    	
  
  $("#modal").modal({escapeClose: !1,clickClose: !1,showClose: !1});
   t = new Toast({
     			message:i18n.t("message")
 			});
   $("#power").bind(touchEvents.touchstart,touchSt);
   $("#power").bind(touchEvents.touchend,powerSend);
   $(".wind").bind(touchEvents.touchstart,touchSt);
   $(".wind").bind(touchEvents.touchend,windSend);
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
			"hekr":"HEKR",
			"about":"关于",
			"diming":"智能风扇",
			"Switch":"开关",
			"Slow":"风速一",
			"Medium":"风速二",
			"Fast":"风速三",
			"connecting":"拼命连接中...",
			"off":"关",
			"on":"开",
			"message":"指令已发送"
		}
	},
	"en-US":{
		"translation":{
			"hekr":"HEKR",
			"about":"about",
			"diming":"Smart fan",
			"Switch":"Switch",
			"Slow":"Slow",
			"Medium":"Medium",
			"Fast":"Fast",
			"connecting":"connecting...",
			"off":"off",
			"on":"on",
			"message":"sended"
		}
	}
};

function touchSt(){
	$(this).addClass("press");
}
function powerSend(){
	var self=$(this),
		dt=self.attr("data")-0,
		i=dt==0?"01":"02",
		data=i+i+"0000",
	    frame=UARTDATA.encode(0x02,data);
	console.log("set_power      :"+frame.replace(/(\w{2})/g,'$1 ').replace(/\s*$/,''))
		self.removeClass("press");
		 var code ='(@devcall "{tid}" (uartdata "{args}") (lambda (x) x))'
			.replace('{tid}',tid)
			.replace('{args}',frame);
			ws.send(code);
		t.show();

}
function windSend(){
	$(".wind").removeClass("press");
	var self=$(this),
		id=self.attr("id"),
		str=null,
		powerDT=$("#power").attr("data")-0;
	switch(id){
		case "Slow":
		str="01";
		break;
		case "Medium":
		str="02";
		break;
		case "Fast":
		str="03";
		break;
		default:
		break;
	}
	if(str==null||powerDT==0){return;}
	 var data="0101"+str+"00",
	    frame=UARTDATA.encode(0x02,data);
	console.log("set_wind      :"+frame.replace(/(\w{2})/g,'$1 ').replace(/\s*$/,''))
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
function setPowerState(e){
	var power=$("#power"),
		i=e==1?1:0;
		if(e==1){
			power.addClass("powerOn");
		}else if(e==2){
			power.removeClass("powerOn");
			$(".wind").removeClass("powerOn");
		}else{return;}
		power.attr("data",i);
}
function setWindState(e){
	$(".wind").removeClass("powerOn");
	var i=$("#power").attr("data")-0,
		str=null;
	if(i==0){return;}
	switch(e){
		case 1: 
		str="Slow";
		break;
		case 2: 
		str="Medium";
		break;
		case 3: 
		str="Fast";
		break;
		default:
		break;
	}
	if(str==null){return;}
	$("#"+str).addClass("powerOn");
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

  



var tid  = getUrlParam("tid");
var host = getUrlParam("host") || "device.hekr.me";

var token =getUrlParam("access_key") ;

var user = Math.floor(Math.random()*100);
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
	 var data="00000000",
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
     console.debug(e.uartdata);
     if(e.tid===tid){
     	var mes=UARTDATA.decode(e.uartdata);
     		console.debug(mes);
     		setPowerState(mes[0]);
     		setWindState(mes[2]);
     	}	
};
var keepconnecting=setInterval(function(){
        ws.send('(ping)');
    },50000);

function clearKeep(){
    clearInterval(keepconnecting);
}

function resetKeep(){
     keepconnecting=setInterval(function(){
        ws.send('(ping)');
    },50000);
}

