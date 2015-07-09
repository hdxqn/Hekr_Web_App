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
   
  // $("#modal").modal({escapeClose: !1,clickClose: !1,showClose: !1});
  //  t = new Toast({
  //    			message:i18n.t("message")
 	// 		});

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
			"light":"照明",
			"lowSpeed":"低速",
			"midspeed":"中速",
			"highspeed":"高速",
			"delay":"延时",
			"timerOn":"定时 开",
			"timerOff":"定时 关",
			"timeShut":"后 关闭",
			"timeTurn":"后 开启",
			"title":"油烟机",
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
			"light":"Lighting",
			"lowSpeed":"lowspeed",
			"midspeed":"midspeed",
			"highspeed":"highspeed",
			"delay":"delay",
			"timerOn":"timeOn",
			"timerOff":"timeOff",
			"timeShut":" to Shut down",
			"timeTurn":" to 	Turn on",
			"title":"Range hood",
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





 function getUrlParam(name) {
     var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if (r != null) return unescape(r[2]);
     return null;
 }



// var Toast = function(config){
// 	this.context = config.context || $('body');
// 	this.message =config.message;
// 	this.time = config.time || 3000;
// 	this.init();
// }

// var msgEntity;
// Toast.prototype = {

// 	init :function(){
// 		$("#toastMessage").remove();

// 		var msgDIV = new Array();
// 		msgDIV.push('<div id="toastMessage">');
// 		msgDIV.push('<span>'+this.message+'</span>');
// 		msgDIV.push('</div>');
// 		msgEntity = $(msgDIV.join('')).appendTo(this.context);

// 		var left =  this.context.width()/2-msgEntity.find('span').width()/2 ;

// 		var bottom = '20px' ;
// 		msgEntity.css({
// 			position:'fixed',
// 			bottom:bottom,
// 			'z-index':'99',
// 			left:left,
// 			'background-color':'#000000',
// 			color:'white',
// 			'font-size':'14px',
// 			padding:'5px',
// 			margin:'0px',
// 			'border-radius':'2px'
// 		});
// 		msgEntity.hide();
// 	},

// 	show :function(){
// 		msgEntity.stop(true);
// 		msgEntity.fadeIn(this.time/2);
// 		msgEntity.fadeOut(this.time/2);
		
// 	}
// }

  



// var tid  = getUrlParam("tid");
// var host = getUrlParam("host") || "device.hekr.me";

// var token =getUrlParam("access_key") ;

// var user = Math.floor(Math.random()*100);
// var url  = "ws://"+host+":8080/websocket/t/"+user+"/code/"+token+"/user";
// var ws   = new ReconnectingWebSocket(url);


// ws.onmessage=function(e){
// 	console.debug("[WEBSOCKET] "+e.data);
// 	SEXP.exec(e.data);
// };

// ws.onerror=function(){
// 	setTimeout(function(){
//          ws.send('(get-state "{tid}")'.replace("{tid}", tid));
//      },100)
// 	console.error("[WEBSOCKET] connection error");
// };

// ws.onopen=function(){
// 	console.debug("[WEBSOCKET] connection opened");
// 	 setTimeout(function(){
//          ws.send('(get-state "{tid}")'.replace("{tid}", tid));
//      },500)
// 	$.modal.close();
// };
// ws.onclose=function(){
// 	console.error("[WEBSOCKET] connection closed");
// };

// window.changestate=function(o){
// 	setPowerState(o.power);
// 	setSliderState(o.timer);
// 	// setTimerState(o.timertodo);
// };

// var keepconnecting=setInterval(function(){
//         ws.send('(ping)');
//     },50000);

// function clearKeep(){
//     clearInterval(keepconnecting);
// }

// function resetKeep(){
//      keepconnecting=setInterval(function(){
//         ws.send('(ping)');
//     },50000);
// }
