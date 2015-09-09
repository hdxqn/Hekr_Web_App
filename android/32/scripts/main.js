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
	adjustLangContent(lang);
	adjustLogo(lang);
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
    $(".timePanel").bind(touchEvents.touchend,timeModeSwitch);
    $("#short").bind(touchEvents.touchend,beShortState);
    $("#long").bind(touchEvents.touchend,beLongState);
    $(".slider").bind(touchEvents.touchstart,sliderMove);
     $(".slider").bind(touchEvents.touchmove,sliderMove);
      $(".slider").bind(touchEvents.touchend,sliderMoveEnd);
      $("#power").bind(touchEvents.touchend,powerSend);
      $("#horn").bind(touchEvents.touchend,hornSend);
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

function adjustLangContent(e){
	$("#"+e).remove();
}
function adjustLogo(e){
	$("#logo").attr("src","images/"+e+"logo.png");
}
function timeModeSwitch(){
	var self=$(this),
	       id=self.data("id")-0,
	       str=null;
	       switch(id){
	       	case 1:
	       	str="#OnTriangle";
	       	break;
	       	case 0:
	       	str="#OffTriangle";
	       	break;
	       	default: 
	       	break;
	       }
	       if(str==null){return;}
	       $(".timePanel").removeClass("pressed");
	       $(".Triangle").addClass("transparent").attr("data",0);
	       self.addClass("pressed");
	       $(str).removeClass("transparent").attr("data",1);
}

function beShortState () {
	var self=$(this),
		dt=self.attr("data")-0;
		if(dt==1){return;}
		self.addClass("transparent").attr("data",1);
		$("#btmArea").addClass("bottom-short");
		$("#timeCtrl").addClass("doDown");
		$("#long").removeClass("transparent").attr("data",0);
		
}
function beLongState () {
	var self=$(this),
		dt=self.attr("data")-0;
		if(dt==1){return;}
		self.addClass("transparent").attr("data",1);
		$("#btmArea").removeClass("bottom-short");
		$("#timeCtrl").removeClass("doDown");
		$("#short").removeClass("transparent").attr("data",0);
}
function sliderMove () {
	var self=$(this),
                   dt=self.attr("data")-0,
                   max=self.attr("max")-0+1,
	      value=self[0].value,
	      str=dt==1?"#hourNum":"#minNum",
	      lt=10+Math.floor(value/max*80);
	      console.log(str);
	      $(str).removeClass("transparent").text(value).css("left",lt+"%");
}
function sliderMoveEnd(){
	$(".timeNum").addClass("transparent");
	var self=$(this),
                   dt=self.attr("data")-0,
	      value=numTransformate(self[0].value),
	      hours=null,
	      mins=null,
	      timeTodo=$("#OnTriangle").attr("data")-0==0?"02":"01",
	      data="030000{{timeToDo}}{{hours}}{{mins}}00";
	      dt==1?hours=value:mins=value;
	      hours=hours==null?"00":hours;
	      mins=mins==null?"00":mins;
	      data=data.replace("{{timeToDo}}",timeTodo)
	      		.replace("{{hours}}",hours)
	      		.replace("{{mins}}",mins);
	    var frame=UARTDATA.encode(0x02,data);
	console.log("set_timer      :"+frame.replace(/(\w{2})/g,'$1 ').replace(/\s*$/,''))
		 var code ='(@devcall "{tid}" (uartdata "{args}") (lambda (x) x))'
			.replace('{tid}',tid)
			.replace('{args}',frame);
			ws.send(code);
		t.show();
}
function powerSend(){
	autoPlay();
	var self=$(this),
	      dt=self.attr("data")-0,
	      data=dt==0?"01010000000000":"01020000000000",
	       frame=UARTDATA.encode(0x02,data);
	console.log("set_power      :"+frame.replace(/(\w{2})/g,'$1 ').replace(/\s*$/,''))
		 var code ='(@devcall "{tid}" (uartdata "{args}") (lambda (x) x))'
			.replace('{tid}',tid)
			.replace('{args}',frame);
			ws.send(code);
		t.show();
}
function hornSend(){
	var self=$(this),
	      dt=self.attr("data")-0,
	        data=dt==0?"02000100000000":"02000100000000",
	       frame=UARTDATA.encode(0x02,data);
	console.log("set_horn      :"+frame.replace(/(\w{2})/g,'$1 ').replace(/\s*$/,''))
		 var code ='(@devcall "{tid}" (uartdata "{args}") (lambda (x) x))'
			.replace('{tid}',tid)
			.replace('{args}',frame);
			ws.send(code);
		t.show();
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
			"message":"sended"
		}
	}
};
function autoPlay(){
var myAuto = document.getElementById('myaudio');
myAuto.play();
}
function setPowerState(e){
	var power=$("#power"),
	      str=null;
	if(e==1){
		power.addClass("pressed").attr("data",1);
		str="on";
	}else if(e==2){
		power.removeClass("pressed").attr("data",0);
		str="off";
	}else{return;}
	$("#powerState").text(i18n.t(str));
}
function setHornState(e){
	if(e==1){
		$("#hornImg").text("&#xf01f4;");
	}else if(e==2){
		$("#hornImg").text("&#xe611;");
	}else{return;}
}
function setTimerPanel(e){
	if(e==1){
		$("#OnState").text(i18n.t("turnOn"));
		$("#timerToOn").click();
	}else if(e==2){
		$("#OnState").text(i18n.t("shutDown"));
		$("#timerToOff").click();
	}else{return;}
}
function setHourState(e){
	if(e==0){return;}
	if(e==255){
		$("#hourShow").text(0);
		$("#hourSlider").val(0);
		return;
	}
	$("#hourShow").text(e);
	$("#hourSlider").val(e);
}
function setMinState(e){
	if(e==0){return;}
	if(e==255){
		$("#minShow").text(0);
		$("#minSlider").val(0);
		return;
	}
	$("#minShow").text(e);
	$("#minSlider").val(e);
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
	 var data="00000000000000",
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
     			setHornState(mes[2]);
     			setTimerPanel(mes[3]);
     			setHourState(mes[4]);
     			setMinState(mes[5]);
     			break;
     			case 1:
     			setPowerState(mes[1]);
     			break;
     			case 2:
     			setHornState(mes[2]);
     			break;
     			case 3:
     			setTimerPanel(mes[3]);
     			setHourState(mes[4]);
     			setMinState(mes[5]);
     			break;
     			default:
     			break;
     		}
     	}	
};

