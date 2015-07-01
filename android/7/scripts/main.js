$(document).ready(function(){
	
	var lang=getUrlParam('lang');
	if(lang===null){
		lang='en-US';
	}

		i18n.init({
        "lng": lang,
        "resStore": resources,
        "fallbackLng" : 'en'
   	 }, function (t) {
        $(document).i18n();
    	});


  $("#power").click(function(e){
  		clearKeep();
		var code ='(@devcall "{tid}" (controlpower {args}) (lambda (x) x))'
    .replace("{tid}",tid)
    .replace("{args}",isPowerOn()?0:1);
		console.debug("[CODE] "+code);
		ws.send(code);
		resetKeep();
    	t.show();
	});

	$("#timer").on("mouseup touchend",function(e){
		clearKeep();
		var v = e.target.value;
		console.debug("[EVENT] slider value is "+v);
		var args = v*3600+" "+ (isPowerOn()?0:1);
		var code ='(@devcall "{tid}" (controltimer {args}) (lambda (x) x))'.replace("{tid}",tid).replace("{args}",args);
		timerChange(v);
		console.debug("[CODE] "+code);
		ws.send(code);
		resetKeep();
		t.show();
	});

  $("#back").click(function(e) {
        console.debug("[EVENT] back button clicked");
        window.close();
    });
	
   
  $("#modal").modal({escapeClose: !1,clickClose: !1,showClose: !1});
   t = new Toast({
     			message:i18n.t("message")
 			});


});




var resources={
	"zh-CN":{
		"translation":{
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
     },100)
	$.modal.close();
};
ws.onclose=function(){
	console.error("[WEBSOCKET] connection closed");
};





var isPowerOn=function(){
	return !$("#power").hasClass("off");
};

var powerOn=function(){
	$("#power").removeClass("off");
	$("#powerState").text(i18n.t('on'));
	$("#timerState1").text(i18n.t('shutDown'));
	$("#timerState2").text(i18n.t('shutDown'));
};

var powerOff=function(){
	$("#power").addClass("off");
	$("#powerState").text(i18n.t('off'));
	$("#timerState1").text(i18n.t('turnOn'));
	$("#timerState2").text(i18n.t('turnOn'));
};


var timerChange=function(v){
	$("#timer").val(v);
	$("#time1").text(v);
	$("#time2").text(v);
};


window.changestate=function(o){
	if(o.power!==undefined){
		o.power==0?powerOff():powerOn();
	}
	if(o.timer!==undefined){
		timerChange(Math.floor(o.timer/3600));
	}
};

var keepconnecting=setInterval(function(){
        ws.send('(ping)');
    },50000);
var _count_=true;
function clearKeep(){
    clearInterval(keepconnecting);
}
function resetKeep(){
     keepconnecting=setInterval(function(){
        ws.send('(ping)');
    },50000);
}
