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
   $(".slider").bind(touchEvents.touchstart,adjustColor);
   $(".slider").bind(touchEvents.touchmove,adjustColor);
   $(".slider").bind(touchEvents.touchend,colorValueSend);

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
			"diming":"RGB调光",
			"Switch":"开关",
			"Red":"红",
			"Green":"绿",
			"Blue":"蓝",
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
			"diming":"RGB diming",
			"Switch":"Switch",
			"Red":"Red",
			"Green":"Green",
			"Blue":"Blue",
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
		data="02"+i+"00000000000000",
	    frame=UARTDATA.encode(0x02,data);
	console.log("set_power      :"+frame.replace(/(\w{2})/g,'$1 ').replace(/\s*$/,''))
		self.removeClass("press");
		 var code ='(@devcall "{tid}" (uartdata "{args}") (lambda (x) x))'
			.replace('{tid}',tid)
			.replace('{args}',frame);
			ws.send(code);
		t.show();

}
function adjustColor(self){
	var self=$(this)||self,
		dt=self.attr("data")-0,
		value=self[0].value;
		if(dt==0){
			rOfRgb=value;
		}else if(dt==1){
			gOfRgb=value;
		}else if(dt==2){
			bOfRgb=value;
		}
		
	render();
}
function colorValueSend(){
	var self=$(this),
		dt=self.attr("data")-0,
		value=self.val(),
		i=numTransformate(value),
		data=null;
		if(dt==0){
			var g=numTransformate(gOfRgb),
			      b=numTransformate(bOfRgb);
			data="0700000000"+i+g+b+"00";
		}else if(dt==1){
			var r=numTransformate(rOfRgb),
			      b=numTransformate(bOfRgb);
			data="0700000000"+r+i+b+"00";
		}else if(dt==2){
			var r=numTransformate(rOfRgb),
			      g=numTransformate(gOfRgb);
			data="0700000000"+r+g+i+"00";
		}else{
			return;
		}
	   var frame=UARTDATA.encode(0x02,data);
	console.log("set_color      :"+frame.replace(/(\w{2})/g,'$1 ').replace(/\s*$/,''));
		adjustColor(self);
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
function render(){
	$(".rgbColor").css("background-color","rgb("+rOfRgb+","+gOfRgb+","+bOfRgb+")");
}
function setPowerState(e){
	var power=$("#power"),
		i=e==1?1:0;
		if(e==1){
			power.addClass("powerOn");
		}else if(e==2){
			power.removeClass("powerOn");
		}
		power.attr("data",i);
}

function setRedValue(e){
		rOfRgb=e;
	$("#redSlider").val(e);
	render();
}
function setGreenValue(e){
		gOfRgb=e;
	$("#greenSlider").val(e);
	render();
}
function setBlueValue(e){
		bOfRgb=e;
	$("#blueSlider").val(e);
	render();
}

 function getUrlParam(name) {
     var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if (r != null) return unescape(r[2]);
     return null;
 }

var rOfRgb=255;
var gOfRgb=246;
var bOfRgb=105;
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
     console.debug(e.uartdata);
     if(e.tid===tid){
     	var mes=UARTDATA.decode(e.uartdata);
     		console.debug(mes);
     		switch(mes[0]){
					case 0:
					setPowerState(mes[1]);
					setRedValue(mes[5]);
					setGreenValue(mes[6]);
					setBlueValue(mes[7]);
					break;
					case 1:
					setPowerState(mes[1]);
					setRedValue(mes[5]);
					setGreenValue(mes[6]);
					setBlueValue(mes[7]);
					break;
					case 2:
					setPowerState(mes[1]);
					break;
					case 7:
					setRedValue(mes[5]);
					setGreenValue(mes[6]);
					setBlueValue(mes[7]);
					break;
					default:
					break;	
				}
     	}	
};


