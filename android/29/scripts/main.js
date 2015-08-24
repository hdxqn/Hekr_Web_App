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
  $("#power").bind(touchEvents.touchend,powerSend);
  $("#mode").bind(touchEvents.touchend,modeSend);
  $("#drainage").bind(touchEvents.touchend,drainageSend);
  $("#humidity").bind(touchEvents.touchend,humiditySend);
  $("#humidity").bind(touchEvents.touchstart,humidityShow);
  $("#humidity").bind(touchEvents.touchmove,humidityShow);
  $("#timer").bind(touchEvents.touchend,timerSend);
  $("#timer").bind(touchEvents.touchstart,timerShow);
  $("#timer").bind(touchEvents.touchmove,timerShow);
  $(".timerSwitch").bind(touchEvents.touchend,timerSwitch);
  $(".reimndBtn").bind(touchEvents.touchend,remindCancle);
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
			"Desiccant":"除湿机",
			"Automatic":"自动",
			"Continuous":"连续",
			"Ordinary":"普通",
			"Defrost":"除霜",
			"currentHumidity":"当前湿度",
			"hoursLater":"小时后",
			"shutDown":"关闭",
			"turnOn":"开启",
			"noTimer":"暂无定时",
			"Switch":"开关",
			"Mode":"模式",
			"Drainage":"排水",
			"humidity":"湿度",
			"timerOn":"定时 开",
			"timerOff":"定时关",
			"cancleTimer":"时间拖至最左边为取消定时",
			"remind":"温馨提示",
			"remindMesOne":"温湿度传感器故障",
			"remindMesTwo":"盘管温度传感器故障",
			"remindMesThree":"水泵故障",
			"contactWorker":"请及时联系维修人员",
			"Determine":"确定",
			"nexttime":"下次提醒",
			"connecting":"拼命连接中...",
			"off":"关",
			"on":"开",
			"message":"指令已发送"
		}
	},
	"en-US":{
		"translation":{
			"Desiccant":"Desiccant",
			"Automatic":"Automatic",
			"Continuous":"Continuous",
			"Ordinary":"Ordinary",
			"Defrost":"Defrost",
			"currentHumidity":"Current Humidity",
			"hoursLater":"h later",
			"shutDown":" to shut Down",
			"turnOn":"to turn On",
			"noTimer":"no Timer",
			"Switch":"Switch",
			"Mode":"Mode",
			"Drainage":"Drainage",
			"humidity":"humidity",
			"timerOn":"timeOn",
			"timerOff":"timeOff",
			"cancleTimer":"move to the left to cancle timer",
			"remind":"remind",
			"remindMesOne":"Temperature and humidity sensor error",
			"remindMesTwo":"Coil and Temperature sensor error",
			"remindMesThree":"Water pump error",
			"contactWorker":"Please contact the maintenance worker in time",
			"Determine":"determine",
			"nexttime":"next time",
			"connecting":"connecting...",
			"off":"off",
			"on":"on",
			"message":"sended"
		}
	}
};

function powerSend(){
	var power=$("#power"),
		dt=power.attr("data")-0,
		i=dt==0?1:2,
		data="010"+i+"0000000000000000",
	    frame=UARTDATA.encode(0x02,data);
	console.log("set_power      :"+frame.replace(/(\w{2})/g,'$1 ').replace(/\s*$/,''))

		 var code ='(@devcall "{tid}" (uartdata "{args}") (lambda (x) x))'
			.replace('{tid}',tid)
			.replace('{args}',frame);
		clearKeep();
		ws.send(code);
		resetKeep();
		t.show();
}
function modeSend(){
	var mode=$("#mode"),
		power=$("power"),
		powerdt=power.attr("data")-0,
		dt=mode.attr("data")-0,
		i=dt>2?1:dt+1,
		data="0300000"+i+"000000000000",
		frame=UARTDATA.encode(0x02,data);
		if(powerdt==0){return;}
		console.log("set_mode      :"+frame.replace(/(\w{2})/g,'$1 ').replace(/\s*$/,''))

		 var code ='(@devcall "{tid}" (uartdata "{args}") (lambda (x) x))'
			.replace('{tid}',tid)
			.replace('{args}',frame);

		clearKeep();
		ws.send(code);
		resetKeep();
		t.show();
}
function drainageSend(){
	var drainage=$("#drainage"),
		power=$("power"),
		dt=power.attr("data")-0,
		data="02000100000000000000",
		frame=UARTDATA.encode(0x02,data);
		if(dt==0){return;}
		console.log("set_drainage      :"+frame.replace(/(\w{2})/g,'$1 ').replace(/\s*$/,''))

		 var code ='(@devcall "{tid}" (uartdata "{args}") (lambda (x) x))'
			.replace('{tid}',tid)
			.replace('{args}',frame);

		clearKeep();
		ws.send(code);
		resetKeep();
		t.show();
		

}
function humiditySend(){
	var humidityNum=$("#humidityNum"),
		self=$(this),
		j=self.val(),
		i=numTransformate(j),
		data="04000000"+i+"0000000000",
		frame=UARTDATA.encode(0x02,data);
		humidityNum.css("opacity",0);
	console.log("set_humidity      :"+frame.replace(/(\w{2})/g,'$1 ').replace(/\s*$/,''))

		 var code ='(@devcall "{tid}" (uartdata "{args}") (lambda (x) x))'
			.replace('{tid}',tid)
			.replace('{args}',frame);
		clearKeep();
		ws.send(code);
		resetKeep();
		t.show();
		
}
function timerSend(){
	var timerNum=$("#timerNum"),
		timeron=$("#timeron"),
		tm=timeron.attr("data")-0,
		k=tm==1?"01":"02",
		self=$(this),
		j=self.val(),
		i=numTransformate(j),
		data="01"+k+"000000000000"+i+"00",
		frame=UARTDATA.encode(0x02,data);
		timerNum.css("opacity",0);
	console.log("set_timer      :"+frame.replace(/(\w{2})/g,'$1 ').replace(/\s*$/,''))

		 var code ='(@devcall "{tid}" (uartdata "{args}") (lambda (x) x))'
			.replace('{tid}',tid)
			.replace('{args}',frame);

		clearKeep();
		ws.send(code);
		resetKeep();
		t.show();
}


function humidityShow(){
	var humidityNum=$("#humidityNum"),
		self=$(this),
		i=self.val(),
		num=Math.floor((i-20)/7*8+10);
		humidityNum.text(i).css({
			"opacity":"1",
			"left":num+"%"
		});

}
function timerShow(){
	var timerNum=$("#timerNum"),
		self=$(this),
		i=self.val(),
		num=Math.floor(i/24*80+10);
		timerNum.text(i).css({
			"opacity":"1",
			"left":num+"%"
		});
}
function timerSwitch(){

	var self=$(this),
		id=self.attr("id"),
		dt=self.attr("data")-0,
		str=null,
		powerdt=$("#power").attr("data")-0,
		num=null;
		if(dt==1){return;}
		switch(id){
			case "timeron":
			str="onTriangle";
			num=0;
			break;
			case "timeroff":
			str="offTriangle";
			num=1;
			break;
			default:
			break;
		}
		if(str==null||num==null||num!=powerdt){return;}
		$(".timerSwitch").attr("data","0").css("opacity","0.2");
		$(".timerTriangle").css("opacity","0");
		self.attr("data","1").css("opacity","1");
		$("#"+str).css("opacity","1");

}

function setPowerState(e,b){
	var power=$("#power"),
		mode=$("#mode");
	    if(e==0||b!=0){return;}
	    else if(e==1){
	    	power.attr("data","1").css("opacity","1");
	    	mode.css("opacity","1");
	    	 $("#timeroff").click();
	    }else if(e==2){
	    	power.attr("data","0").css("opacity","0.2");
	    	mode.css("opacity","0.2");
	    	 $("#timeron").click();
	    }

}
function setDrainageState(e,b){
	var power=$("#power"),
		dt=power.attr("data")-0,
	    drainage=$("#drainage");
	    if(dt==0){return;}
	    if(b==0&&e==0){
	    	drainage.css({
			"background-color":"transparent",
			"border-color":"#fff"
		});
		drainage.find("i").css("color","#fff");
	    }else if(b==0&&e==1){
	    	drainage.css({
			"background-color":"transparent",
			"border-color":"#fff"
		});
		drainage.find("i").css("color","#D35E67");
	    }else if(b==2&&e==1){
	    	drainage.css({
			"background-color":"#D35E67",
			"border-color":"#D35E67"
		});
		drainage.find("i").css("color","#fff");
	}

}
function setModeState(e){
	var power=$("#power"),
		dt=power.attr("data")-0,
	    mode=$("#mode"),
	    humidityContainer=$("#humidityContainer")
	    hdt=humidityContainer.attr("data")-0,
	    modeShow=$("#modeShow");
	    if(dt==0){return;}

	    if(e==0){return;}else if(e==1){
	    	modeShow.text(i18n.t("Continuous"));
	    	if(hdt==1){
	    		humidityContainer.addClass("heightCtrl").attr("data","0");
	    	}
	    }else if(e==2){
	    	modeShow.text(i18n.t("Automatic"));
	    	if(hdt==1){
	    		humidityContainer.addClass("heightCtrl").attr("data","0");
	    	}
	    }else if(e==3){
	    	modeShow.text(i18n.t("Ordinary"));
	    	if(hdt==0){
	    		humidityContainer.removeClass("heightCtrl").attr("data","1");
	    	}
	    }
	    mode.attr("data",e);
}

function setHumidityState(e){
	var humidity=$("#humidity"),
		HumidityShow=$("#HumidityShow");
		humidity.val(e);
		HumidityShow.text(e+"%");
}

function setTemperatureState(e){
	var temperatureNum=$("#temperatureNum");
	temperatureNum.text(e);
}

function setDefrostState(e){
	var defrostState=$("#defrostState");
	if(e==0){
		defrostState.text(i18n.t("off"));
	}else if(e==1){
		defrostState.text(i18n.t("on"));
	}
}
function reminder(e){
	
	if(e==0||remindState){return;}
	var str=null,
	    remind=$("#remind"),
	    remindText=$("#remindText");
	 if(e==1){
		str="remindMesOne";
	}else if(e==2){
		str="remindMesTwo";
	}else if(e==3){
		str="remindMesThree";
	}
	remindText.text(i18n.t(str));
	remind.css("display","block");
}
function remindCancle(){
	var remind=$("#remind");
	remind.css("display","none");
	remindState=true;
}
var remindState=false;

function setTimerState(a,b,c){
	// if(a!=1){return;}
	var arr=["turnOn","shutDown"];
	if(c==0){
		arr=arr.reverse();
	}
	if(b==1){
		// $("#timeron").click();
		$("#timerState").text(i18n.t(arr[0]));
	}else if(b==2){
		// $("#timeroff").click();
		$("#timerState").text(i18n.t(arr[1]));
	}else{
		return;
	}
	$("#timerHours").text(c);
	$("#timer").val(c);
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
	
	console.error("[WEBSOCKET] connection error");
};

ws.onopen=function(){
	console.debug("[WEBSOCKET] connection opened");
	 var data="00000000000000000000",
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
					setPowerState(mes[1],mes[8]);
					setDrainageState(mes[2],mes[0]);
					setModeState(mes[3]);
					setHumidityState(mes[4]);
					setTemperatureState(mes[5]);
					reminder(mes[6]);
					setDefrostState(mes[7]);
					setTimerState(mes[0],mes[1],mes[8]);
					break;
					case 1:
					setPowerState(mes[1],mes[8]);
					setTimerState(mes[0],mes[1],mes[8]);
					break;
					case 2:
					setDrainageState(mes[2],mes[0]);
					break;
					case 3:
					setModeState(mes[3]);
					break;
					case 4:
					setHumidityState(mes[4]);
					break;
					default:
					break;	
				}
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

