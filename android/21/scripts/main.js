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
  $('#li_power').bind(touchEvents.touchend,powerSend);
  $('#li_light').bind(touchEvents.touchend,lightSend);
  $('#li_lowspeed').bind(touchEvents.touchend,speedSend);
  $('#li_midspeed').bind(touchEvents.touchend,speedSend);
  $('#li_highspeed').bind(touchEvents.touchend,speedSend);
  $('#li_delay').bind(touchEvents.touchend,delaySend);
  $('#li3').bind(touchEvents.touchend,timerSlide);
  $('#li_timer').bind(touchEvents.touchend,timeSetShow);
  $("#cancle").bind(touchEvents.touchend,timeSetHide);
  $("#confirm").bind(touchEvents.touchend,timeSetSend);
  $("#numContainerH").bind(touchEvents.touchstart,slideTimerStart);
  $("#numContainerH").bind(touchEvents.touchend,slideTimerEnd);
  $("#numContainerM").bind(touchEvents.touchstart,slideTimerStart);
  $("#numContainerM").bind(touchEvents.touchend,slideTimerEnd);

  
  

   
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
			"confirm":"确认",
			"timerSet":"时间设置",
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
			"timer":"时间",
			"power":"开关",
			"timing":"定时",
			"message":"指令已发送"
		}
	},
	"en-US":{
		"translation":{
			"confirm":"confirm",
			"timerSet":"timerSet",
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
			"timer":"timer",
			"power":"Power",
			"timing":"timer",
			"message":"sended"
		}
	}
};

function powerSend(){
	var i=$(this).attr('data')==1?2:1;

	var data="020"+i+"0000000000000000",
	    frame=UARTDATA.encode(0x02,data);
	console.log("set_power      :"+frame.replace(/(\w{2})/g,'$1 ').replace(/\s*$/,''))

		 var code ='(@devcall "{tid}" (uartdata "{args}") (lambda (x) x))'
			.replace('{tid}',tid)
			.replace('{args}',frame);

		ws.send(code);

		t.show();
}

function setPowerState(e){
	if(e==1){
		$('#li_power').attr('data',1).css('background-color','rgba(255,255,255,0.3)');
		$('#on').text(i18n.t('on'));
	}else if (e==2) {
		$('#li_power').attr('data',0).css('background-color','transparent');
		$('#on').text(i18n.t('off'));
	};
}
function lightSend(){
	var i=$(this).attr('data')==1?2:1;


	var data="0401000"+i+"000000000000",
	    frame=UARTDATA.encode(0x02,data);
	console.log("set_light     :"+frame.replace(/(\w{2})/g,'$1 ').replace(/\s*$/,''))

		 var code ='(@devcall "{tid}" (uartdata "{args}") (lambda (x) x))'
			.replace('{tid}',tid)
			.replace('{args}',frame);

		ws.send(code);

		t.show();
}

function setLightingState(e){
	if(e==1){
		$('#li_light').attr('data',1).css('background-color','rgba(255,255,255,0.3)');
	}else if (e==2) {
		$('#li_light').attr('data',0).css('background-color','transparent');
	};
}

function speedSend(){
	var speed=$(this).attr('id'),
		i=null;
		switch(speed){
			case 'li_lowspeed':
			i=2;
			break;
			case 'li_midspeed':
			i=3;
			break;
			case 'li_highspeed':
			i=4;
			break;
			default: 
			i=1;
			break;
		}
	var data="050100000"+i+"0000000000",
	    frame=UARTDATA.encode(0x02,data);
	console.log("set_speed     :"+frame.replace(/(\w{2})/g,'$1 ').replace(/\s*$/,''))

		 var code ='(@devcall "{tid}" (uartdata "{args}") (lambda (x) x))'
			.replace('{tid}',tid)
			.replace('{args}',frame);

		ws.send(code);

		t.show();
}

function setSpeedState(e){
	var str=null;
	switch(e){
		case 2:
		str='li_lowspeed';
		break;
		case 3:
		str='li_midspeed';
		break;
		case 4:
		str='li_highspeed';
		break;
		default: 
		break;
	}
	$('#li_lowspeed').attr('data',0).css('background-color','transparent');
	$('#li_midspeed').attr('data',0).css('background-color','transparent');
	$('#li_highspeed').attr('data',0).css('background-color','transparent');
	$('#'+str).attr('data',1).css('background-color','rgba(255,255,255,0.3)');

}

function delaySend(){
	var i=$(this).attr('data')==1?2:1;


	var data="03000"+i+"00000000000000",
	    frame=UARTDATA.encode(0x02,data);
	console.log("set_delay     :"+frame.replace(/(\w{2})/g,'$1 ').replace(/\s*$/,''))

		 var code ='(@devcall "{tid}" (uartdata "{args}") (lambda (x) x))'
			.replace('{tid}',tid)
			.replace('{args}',frame);

		 ws.send(code);

		 t.show();
}

function setDelayState(e){
	if(e==1){
		$('#li_delay').attr('data',1).css('background-color','rgba(255,255,255,0.3)');
	}else if (e==2) {
		$('#li_delay').attr('data',0).css('background-color','transparent');
	};
}


function timeSetShow(){

	$("#li3").css("display","block");
	var elesH=$("#numContainerH").find(".num"),
		elesM=$("#numContainerM").find(".num1"),
		time=new Date(),
		hour=time.getHours(),
		minute=time.getMinutes();
		for(var i=0;i<elesH.length;i++){
		
			timeSetNow(elesH[i],hour,24);
			timeSetNow(elesM[i],minute,60);
		}
}

function timeSetHide(){
	$("#li3").css("display","none");
}

function timeSetNow(obj,n,t){
	if($(obj).hasClass("show")){
		
	}else if($(obj).hasClass("up")){
		n=n-1<0?n+(t-1):n-1;
	}else if($(obj).hasClass("down")){
		n=n+1>=t?(n+1)-t:n+1;
	}else{return;}
	   $(obj).attr('data',n);
		var str=n<10?'0'+n:n;
		$(obj).text(str);
}



function timeSetSend(){
	timeSetHide();
	var hour =$("#numContainerH").find(".show").attr("data"),
		minute =$("#numContainerM").find(".show").attr("data"),
		arr=new Array(hour,minute);

		$.each(arr,function(i){
			arr[i]="0123456789ABCDEF"[(arr[i]%256)>>>4]+"0123456789ABCDEF"[arr[i]%16];
		});
		console.debug(arr[0]+'    '+arr[1]);


	var data="0601000000"+arr[0]+arr[1]+"000000",
	    frame=UARTDATA.encode(0x02,data);
	console.log("timeSet     :"+frame.replace(/(\w{2})/g,'$1 ').replace(/\s*$/,''))

		 var code ='(@devcall "{tid}" (uartdata "{args}") (lambda (x) x))'
			.replace('{tid}',tid)
			.replace('{args}',frame);
			 ws.send(code);


		 t.show();
}

function timerSlide(event){
	event=event||window.event;
	var id=$(this).attr('id'),
	
	    posY=event.originalEvent.changedTouches[0].clientY||event.clientY,
	    posX=event.originalEvent.changedTouches[0].clientX||event.clientX,
	    top=getScrollTop(),
	    deltaY=posY-$('#'+id).offset().top+top,
	    deltaX=posX-$(this).width()/2;
	    if(deltaY>=120&&deltaX<=0){
	    	//左上角
	    	hourSlideDown();
	    }else if(deltaY>120&&deltaX>0){
	    	//右下角
	    	minuteSlideDown();
	    }else if(deltaY<120&&deltaX<=0){
	    	//左下角
	    	hourSlideUp();
	    }else if(deltaY<120&&deltaX>0){
	  		//右上角
	  		minuteSlideUp();
	    }
}
function getScrollTop() {  
        var scrollPos;  
        if (window.pageYOffset) {  
        scrollPos = window.pageYOffset; }  
        else if (document.compatMode && document.compatMode != 'BackCompat')  
        { scrollPos = document.documentElement.scrollTop; }  
        else if (document.body) { scrollPos = document.body.scrollTop; }   
        return scrollPos;   
}  
function hourSlideDown(){
	var eles=$('#numContainerH').find('.num');
	var num=null;
	eles.each(function(){
		if($(this).hasClass('show')){
		num=$(this).attr('data');
		num-=0;
		}
	});
	for(var i=0;i<eles.length;i++){
		if($(eles[i]).hasClass('show')){
			$(eles[i]).addClass('down').removeClass('show');
		}else if($(eles[i]).hasClass('up')){
			$(eles[i]).removeClass('up').addClass('show');
		}else if($(eles[i]).hasClass('down')){
			$(eles[i]).removeClass('down').addClass('hideup');
		}else{
			var str=null;
			if(num<2){
				num+=22;
				str=num+'';
			}else if(num>=2&&num<12){
				num-=2;
				str = '0'+num;
					
			}else if(num>=12){
				num-=2;
				str=num;
			}
			$(eles[i]).text(str);
			$(eles[i]).removeClass('hidedown hideup').addClass('up').attr('data',num);
		}
	}
}

function hourSlideUp(){
	var eles=$('#numContainerH').find('.num');
	var num=null;
	eles.each(function(){
		if($(this).hasClass('show')){
		num=$(this).attr('data');
		num-=0;
		}
	});
	for(var i=0;i<eles.length;i++){
		if($(eles[i]).hasClass('show')){
			$(eles[i]).addClass('up').removeClass('show');
		}else if($(eles[i]).hasClass('up')){
			$(eles[i]).removeClass('up').addClass('hidedown');
		}else if($(eles[i]).hasClass('down')){
			$(eles[i]).removeClass('down').addClass('show');
		}else{
			var str=null;
			if(num>21){
				num-=22;
				str='0'+num;
			}else if(num<8){
				num+=2;
		 		str = '0'+num;	
			}else if(num>=8&&num<=21){
				num+=2;
				str=num+'';
			}
			$(eles[i]).text(str);
			$(eles[i]).removeClass('hidedown hideup').addClass('down').attr('data',num);
		}
	}
}
function minuteSlideUp(){
	var eles=$('#numContainerM').find('.num1');
	var num=null;
	eles.each(function(){
		if($(this).hasClass('show')){
		num=$(this).attr('data');
		num-=0;
		}
	});
	for(var i=0;i<eles.length;i++){
		if($(eles[i]).hasClass('show')){
			$(eles[i]).addClass('up').removeClass('show');
		}else if($(eles[i]).hasClass('up')){
			$(eles[i]).removeClass('up').addClass('hidedown');
		}else if($(eles[i]).hasClass('down')){
			$(eles[i]).removeClass('down').addClass('show');
		}else{
			var str=null;
			if(num>57){
				num-=58;
				str='0'+num;
			}else if(num<8){
				num+=2;
		 		str = '0'+num;	
			}else if(num>=8&&num<=57){
				num+=2;
				str=num+'';
			}
			$(eles[i]).text(str);
			$(eles[i]).removeClass('hidedown hideup').addClass('down').attr('data',num);
		}
	}
}

function minuteSlideDown(){
	var eles=$('#numContainerM').find('.num1');
	var num=null;
	eles.each(function(){
		if($(this).hasClass('show')){
		num=$(this).attr('data');
		num-=0;
		}
	});
	for(var i=0;i<eles.length;i++){
		if($(eles[i]).hasClass('show')){
			$(eles[i]).addClass('down').removeClass('show');
		}else if($(eles[i]).hasClass('up')){
			$(eles[i]).removeClass('up').addClass('show');
		}else if($(eles[i]).hasClass('down')){
			$(eles[i]).removeClass('down').addClass('hideup');
		}else{
			var str=null;
			if(num>11){
				num-=2;
				str=''+num;
			}else if(num<=11&&num>=2){
				num-=2;
		 		str = '0'+num;	
			}else if(num<2){
				num+=58;
				str=num+'';
			}
			$(eles[i]).text(str);
			$(eles[i]).removeClass('hidedown hideup').addClass('up').attr('data',num);

		}
	}
	
}
function slideTimerStart(event){
	event=event||window.event;
	startPosY=event.originalEvent.touches[0].pageY;
	$(this).bind(touchEvents.touchmove,slideTimerMove);
}

function slideTimerEnd(event){
	event=event||window.event;
	$(this).unbind(touchEvents.touchmove,slideTimerMove);
	event.stopPropagation();
}


var slideTimerMove = (function(){
	var oldTime=new Date();
	return function(event){
		event=event||window.event;
		event.preventDefault();
		var newTime=new Date(),
			endPosY=event.originalEvent.touches[0].pageY,
			deltaTime=newTime-oldTime,
			deltaY=endPosY-startPosY;
			if(deltaTime<=500||Math.abs(deltaY)<30){
				return;
			}else if(deltaY>0){
				var id=$(this).attr("id");
				id=="numContainerH"?hourSlideDown():minuteSlideDown();
				oldTime=newTime;
			}else if(deltaY<0){
				var id=$(this).attr("id");
				id=="numContainerH"?hourSlideUp():minuteSlideUp();
				
				oldTime=newTime;
			}
	};
})();





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
var startPosY=null;

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
	console.debug("[CONNECTED]");
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

window.changestate=function(o){
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
     			setDelayState(mes[2]); 	
     		 	setLightingState(mes[3]);
     		 	setSpeedState(mes[4]); 
     		 	break;
     		 case 2:
     		  setPowerState(mes[1]);
     		  break;
     		 case 3:
     		 setDelayState(mes[2]);
     		 break;
     		 case 4:
     		  setLightingState(mes[3]);
     		  break;
     		 case 5:
     		 setSpeedState(mes[4]);
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
