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
  $("#back").click(function() {
        console.debug("[EVENT] back button clicked");
        window.close();
    });
  $('#power').bind(touchEvents.touchend,powerClick);
  $('.slider').bind(touchEvents.touchstart,sliderStart);
  $('.slider').bind(touchEvents.touchend,sliderEnd);
  $('#timerOn').bind(touchEvents.touchend,timerSwitch);
  $('#timerOff').bind(touchEvents.touchend,timerSwitch);
   
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
			"timerOn":"定时 开",
			"timerOff":"定时 关",
			"timeShut":"后 关闭",
			"timeTurn":"后 开启",
			"socket":"插座",
			"state":"当前状态",
			"connecting":"拼命连接中...",
			"off":"关",
			"on":"开",
			"shutDown":"关闭",
			"turnOn":"开启",
			"timer":"h后",
			"power":"开关",
			"timing":"定时",
			"message":"指令已发送"
		}
	},
	"en-US":{
		"translation":{
			"timerOn":"timeOn",
			"timerOff":"timeOff",
			"timeShut":" to Shut down",
			"timeTurn":" to 	Turn on",
			"socket":"Outlet",
			"state":"Current state",
			"connecting":"connecting...",
			"off":"off",
			"on":"on",
			"shutDown":"shut down",
			"turnOn":"turn on",
			"timer":"h to",
			"power":"Power",
			"timing":"timer",
			"message":"sended"
		}
	}
};

function timerSwitch(){
	 var str=this.id;
	 	if(str=='timerOn'){
	 		if($('#onTriangle').attr('data')==1){return;}
	 		$(this).css('opacity','1');
	 		$('#onTriangle').attr('data','1').css('opacity','1');
	 		$('#timerOff').css('opacity','0.2');
	 		$('#offTriangle').attr('data','0').css('opacity','0');
	 	}else if(str=='timerOff'){
	 		if($('#offTriangle').attr('data')==1){return;}
	 		$(this).css('opacity','1');
	 		$('#onTriangle').attr('data','0').css('opacity','0');
	 		$('#timerOn').css('opacity','0.2');
	 		$('#offTriangle').attr('data','1').css('opacity','1');
	 	}

}

function powerClick(){
	var state=$('#power').attr('data');
			clearKeep();
			var code ='(@devcall "{tid}" (controlpower {args}) (lambda (x) x))'
    		.replace("{tid}",tid)
    		.replace("{args}",state==0?1:0);
				console.debug("[CODE] "+code);
				ws.send(code);
				resetKeep();
    			t.show();
}

function sliderStart(event){
	  $(this).bind(touchEvents.touchmove,sliderMove);

	var lt=($(this).val()/this.max)*80+10;
	if(this.id=='hours'){
		$('#sliderCount1').css({
			'opacity':'1',
			'left':lt+'%'
		});
		$('#sliderCount1').text($(this).val());
	}else if(this.id=='minutes'){
		$('#sliderCount2').css({
			'opacity':'1',
			'left':lt+'%'
		});
		$('#sliderCount2').text($(this).val());
	}
}
function sliderMove(event){
		var lt=($(this).val()/this.max)*80+10;
	if(this.id=='hours'){
		$('#sliderCount1').css({
			'opacity':'1',
			'left':lt+'%'
		});
		$('#sliderCount1').text($(this).val());
	}else if(this.id=='minutes'){
		$('#sliderCount2').css({
			'opacity':'1',
			'left':lt+'%'
		});
		$('#sliderCount2').text($(this).val());
	}
}
function sliderEnd(event){
	var powerstate=$('#onTriangle').attr('data'),
		hour=$('#hours').val(),
		minute=$('#minutes').val();
	$(this).unbind(touchEvents.touchmove,sliderMove);
	$('.sliderCount').css('opacity','0');
			clearKeep();
			var code ='(@devcall "{tid}" (controltimer {args} {args2}) (lambda (x) x))'
    		.replace("{tid}",tid)
    		.replace("{args}",hour*3600+minute*60)
    		.replace("{args2}",powerstate==0?0:1);
				console.debug("[CODE] "+code);
				ws.send(code);
				resetKeep();
    			t.show();
}

function setPowerState(num){
	var state=num==0?i18n.t("off"):i18n.t("on");
	if(num==0){
		$('#power').css('opacity','0.2');
		$('#power').attr('data',num);
		$('#on').text(state);
	}else if(num==1){
		$('#power').css('opacity','1');
		$('#power').attr('data',num);
		$('#on').text(state);
	}
}
function setSliderState(num){
	if (num==0) {
		$('#timerState').css('opacity','0');
		return;
	}
	$('#timerState').css('opacity','1');
	var hour=Math.floor(num/3600),
		minute=Math.floor((num%3600)/60);
		$('#hours').val(hour);
		$('#minutes').val(minute);

}
function setTimerState(num){
	if(num==1){
		$('#timerOn').css('opacity','1');
		$('#onTriangle').css('opacity','1');
		$('#onTriangle').attr('data','1');
		$('#timerOff').css('opacity','0.2');
		$('#offTriangle').css('opacity','0');
		$('#offTriangle').attr('data','0');
		$('#onMode').text(i18n.t("timeTurn"));
	}else if(num==0){
		$('#timerOn').css('opacity','0.2');
		$('#onTriangle').css('opacity','0');
		$('#onTriangle').attr('data','0');
		$('#timerOff').css('opacity','1');
		$('#offTriangle').css('opacity','1');
		$('#offTriangle').attr('data','1');
		$('#onMode').text(i18n.t("timeShut"));
	}

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
	console.debug("[WEBSOCKET] connection opened");
	 setTimeout(function(){
         ws.send('(get-state "{tid}")'.replace("{tid}", tid));
     },500)
	$.modal.close();
};
ws.onclose=function(){
	console.error("[WEBSOCKET] connection closed");
};

window.changestate=function(o){
	setPowerState(o.power);
	setSliderState(o.timer);
	setTimerState(o.timertodo);
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
