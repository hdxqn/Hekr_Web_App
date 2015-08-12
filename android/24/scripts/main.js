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
  $("html").bind(touchEvents.touchstart,function(event){
  	event=event||window.event;
  	event.preventDefault();
  });
  $(".rebound").bind(touchEvents.touchstart,reboundPress);
   $(".rebound").bind(touchEvents.touchend,reboundUnPress);
   $(".lightsGroup div").bind(touchEvents.touchend,lightSwitch);
   $(".lightsGroup div").bind(touchEvents.touchstart,lightPress);
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
			"cold":"冷",
			"warm":"暖",
			"dark":"暗",
			"brightness":"亮",
			"allOn":"全开",
			"allOff":"全关",
			"nightLight":"小夜灯",
			"mode":"情景模式",
			"remoteControl":"遥控器",
			"connecting":"拼命连接中...",
			"off":"关",
			"on":"开",
			"message":"指令已发送"
		}
	},
	"en-US":{
		"translation":{
			"cold":"cold",
			"warm":"warm",
			"dark":"dark",
			"brightness":"bright",
			"allOn":"AllOn",
			"allOff":"AllOff",
			"nightLight":"NightLight",
			"mode":"Profiles",
			"remoteControl":"Remote Control",
			"connecting":"拼命连接中...",
			"off":"off",
			"on":"on",
			"message":"指令已发送"
		}
	}
};


function reboundPress(){
	$(this).addClass("selected");
	
}
function reboundUnPress(){
	$(this).removeClass("selected");
	var num=$(this).attr("data")-0;
	switch(num){
		case 1:
		AllOn();
		break;
		case 2:
		AllOff();
		break;
		case 3:
		commondSend("080");
		break;
		case 4:
		commondSend("090");
		break;
		case 5:
		commondSend("070");
		break;
		case 6:
		commondSend("060");
		break;
		case 7:
		commondSend("050");
		break;
		case 8:
		commondSend("040");
		break;
		default:
		break;
	}
}
function lightPress(){
	var self=$(this),
		dt=self.attr("data")-0;
		if(dt==3){return;}
		self.addClass("lightBorder");
}
function lightSwitch(){
	var self=$(this),
		dt=self.attr("data")-0,
		pt=self.parent(),
		div=pt.find("div"),
		num=pt.attr("num"),
		comd=null;
		if(dt==1){
			pt.attr("data",0);
			div.removeClass("lightBorder");
			comd="02";
		}else if(dt==0){
			AllOff(true);
			pt.attr("data",1);
			self.removeClass("lightBorder");
			div.eq(1).addClass("lightBorder");
			comd="01";
		}else if(dt==3){
			AllOff(true);
			var st=pt.attr("data")-0;
			if(st==0){
				pt.attr("data",1);
			self.addClass("lightBorder");
		}else if(st==1){
			pt.attr("data",0);
			self.removeClass("lightBorder");
		}
		return;
		}
		var data=comd+"0"+num+"00",
	    frame=UARTDATA.encode(0x02,data);
		
	console.log("open_light      :"+frame.replace(/(\w{2})/g,'$1 ').replace(/\s*$/,''));

		 var code ='(@devcall "{tid}" (uartdata "{args}") (lambda (x) x))'
			.replace('{tid}',tid)
			.replace('{args}',frame);

		ws.send(code);
		t.show();
}
function AllOn(){
	var data="010000";
		
		AllOff(true);
		var frame=UARTDATA.encode(0x02,data);
	console.log("all_open      :"+frame.replace(/(\w{2})/g,'$1 ').replace(/\s*$/,''));

		 var code ='(@devcall "{tid}" (uartdata "{args}") (lambda (x) x))'
			.replace('{tid}',tid)
			.replace('{args}',frame);

		ws.send(code);
		t.show();

}
function AllOff(arg){
	var liNode=$(".lightsGroup"),
		liDiv=liNode.find("div"),
		data="020000";
		liNode.attr("data",0);
		liDiv.removeClass("lightBorder");
		if(arg){return;}
		var frame=UARTDATA.encode(0x02,data);
	console.log("all_shut      :"+frame.replace(/(\w{2})/g,'$1 ').replace(/\s*$/,''));

		 var code ='(@devcall "{tid}" (uartdata "{args}") (lambda (x) x))'
			.replace('{tid}',tid)
			.replace('{args}',frame);

		ws.send(code);
		t.show();
}
function commondSend(str){
	var liNode=$(".lightsGroup"),
		dt=null,
		nm=null,
		data=null;
		for(var i=0;i<liNode.length;i++){
			dt=liNode.eq(i).attr("data")-0;
			if(dt==1){
				nm=liNode.eq(i).attr("num")-0;
				data=str+nm+"00";
				break;
			}
		}
		if(data==null){
			data=str+"000";
		}
		var frame=UARTDATA.encode(0x02,data);
	console.log("night_light      :"+frame.replace(/(\w{2})/g,'$1 ').replace(/\s*$/,''));

		 var code ='(@devcall "{tid}" (uartdata "{args}") (lambda (x) x))'
			.replace('{tid}',tid)
			.replace('{args}',frame);

		ws.send(code);
		t.show();
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
		var left = msgEntity.find('span').width()/2 ;
		msgEntity.css("margin","0 0 0 -"+left+"px");
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
	// setTimeout(function(){
 //         ws.send('(get-state "{tid}")'.replace("{tid}", tid));
 //     },100)
	console.error("[WEBSOCKET] connection error");
};

ws.onopen=function(){
	console.debug("[WEBSOCKET] connection opened");
	$.modal.close();
};
ws.onclose=function(){
	console.error("[WEBSOCKET] connection closed");
};

window.changestate=function(o){
};

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
