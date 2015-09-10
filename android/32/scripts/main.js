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
	      $(str).removeClass("transparent").text(value).css("left",lt+"%");
}
function sliderMoveEnd(){
	$(".timeNum").addClass("transparent");
	var hour=$('#hourSlider').val(),
	      minute=$('#minSlider').val(),
	      timeTodo=$("#OnTriangle").attr("data")-0==0?0:1,
	      code ='(@devcall "{tid}" (controltimer {args} {args2}) (lambda (x) x))'
    		.replace("{tid}",tid)
    		.replace("{args}",hour*3600+minute*60)
    		.replace("{args2}",timeTodo);
				console.debug("[CODE] "+code);
				ws.send(code);
    			t.show();
}
function powerSend(){
	autoPlay();
	var self=$(this),
	      dt=self.attr("data")-0,
	     code ='(@devcall "{tid}" (controlpower {args}) (lambda (x) x))'
    		.replace("{tid}",tid)
    		.replace("{args}",dt==0?1:0);
				console.debug("[CODE] "+code);
				ws.send(code);
    			t.show();
}
function hornSend(){
	var self=$(this),
	      dt=self.attr("data")-0,
	      i=dt==0?1:0,
	      eles=document.getElementById("hornImg");
	      if(dt==0){
	      	eles.innerHTML="&#xf01f4;";
	}else if(dt==1){
		eles.innerHTML="&#xe611;";
	}else{return;}
	self.attr("data",i);
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
var myAuto = document.getElementById('myaudio'),
	horn=document.getElementById("horn").getAttribute("data")-0;
	if(horn==0){return;}
myAuto.play();
}
function setPowerState(e){
	var power=$("#power"),
	      str=null;
	if(e==1){
		power.addClass("pressed").attr("data",1);
		str="on";
	}else if(e==0){
		power.removeClass("pressed").attr("data",0);
		str="off";
	}else{return;}
	$("#powerState").text(i18n.t(str));
}

function setTimerPanel(e){
	if(e==1){
		$("#OnState").text(i18n.t("turnOn"));
		$("#timerToOn").click();
	}else if(e==0){
		$("#OnState").text(i18n.t("shutDown"));
		$("#timerToOff").click();
	}else{return;}
}
function setHourState(e){
	var value=Math.floor(e/3600);
	$("#hourShow").text(value);
	$("#hourSlider").val(value);
}
function setMinState(e){
	var value=Math.floor((e%3600)/60);
	$("#minShow").text(value);
	$("#minSlider").val(value);
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
		setTimeout(function(){
			   ws.send('(get-state "{tid}")'.replace("{tid}", tid));
			},500);	
	$.modal.close();
};
ws.onclose=function(){
	console.error("[WEBSOCKET] connection closed");
};

window.changestate=function(o){
	
console.debug("[STATE] ================");
     console.debug(o); 
     console.debug("[STATE] ================");
   setPowerState(o.power);
	setHourState(o.timer);
	setMinState(o.timer)
	setTimerPanel(o.timertodo);
};

