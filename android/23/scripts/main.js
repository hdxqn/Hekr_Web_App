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
	localInit();
	saveChanges(lang);
 
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
 $(".little").bind(touchEvents.touchend,chooseMain);
 $(".btns").bind(touchEvents.touchstart,press);
  $(".btns").bind(touchEvents.touchend,release);
  $("#return").bind(touchEvents.touchend,returnChoose);
  $(".changeN").bind(touchEvents.touchstart,cancleNamePress);
    $(".changeN").bind(touchEvents.touchend,cancleNamePressed);
      $(".btnName").bind(touchEvents.touchstart,otherNameStart);
    $(".btnName").bind(touchEvents.touchend,otherName);
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
// localStorage.removeItem("zh-CN");
// localStorage.removeItem("en-US");
function localInit(){
	var a=localStorage.getItem("zh-CN"),
	      b=localStorage.getItem("en-US");
	      if(a||b){return;}
	      localStorage.setItem("zh-CN",'{"btn1":"按钮1","btn2":"按钮2","btn3":"按钮3","btn4":"按钮4","last":"9"}');
 	      localStorage.setItem("en-US",'{"btn1":"button1","btn2":"button2","btn3":"button3","btn4":"button4","last":"9"}');
}
function saveChanges(lang){
	if(lang==undefined){return;}
	var jd=null,
	cg=null;
	jd=resources[lang]["translation"],
	num=null;
	cg=$.parseJSON(localStorage.getItem(lang));
	 jd=$.extend(jd,cg);
	 num=cg["last"]-0;
	 if(num>3){return;}
	 chooseMain($(".little").eq(num));
}
function cancleNamePress(){
	$(this).addClass("pressed");
}
function cancleNamePressed(event){
	$(".changeN").removeClass("pressed");
	var dt=$(this).attr("data-cd")-0;
	if(dt==0){
		$("#nameText").val("");
		$("#changeName").css("display","none");
		return;
	}
	var nameText=$("#nameText"),
  	      ndt=nameText.attr("data"),
  	      newname=nameText.val();
  	      if(newname==""){return; }
  	      $("#"+ndt).find("span").text(newname);
  	      nameText.val("");
  	      $("#changeName").css("display","none");
  	      localReset(ndt,newname);
}
function localReset(a,b){
	var lang=getUrlParam('lang')||"en-US",
	      re=localStorage.getItem(lang),
	      ps=$.parseJSON(re),
	      str=null;
	      ps[a]=b;
	      str=JSON.stringify(ps);
	       localStorage.setItem(lang,str);
}
function otherName(event){
	event.stopPropagation();
	var changeName=$("#changeName"),
	      father=$(this).data("father");
	changeName.css("display","block");
	$("#nameText").attr("data",father);
}
function otherNameStart(event){
	event.stopPropagation();
}
var resources={
	"zh-CN":{
		"translation":{
			"one":"1",
			"two":"2",
			"three":"3",
			"four":"4",
			"btn1":"按钮1",
			"btn2":"按钮2",
			"btn3":"按钮3",
			"btn4":"按钮4",
			"totalSwitch":"总开关",
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
			"message":"指令已发送",
			"OK":"确定",
			"CANCLE":"取消"
		}
	},
	"en-US":{
		"translation":{
			"one":"1",
			"two":"2",
			"three":"3",
			"four":"4",
			"btn1":"button1",
			"btn2":"button2",
			"btn3":"button3",
			"btn4":"button4",
			"totalSwitch":"Total switch",
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
			"message":"sended",
			"OK":"OK",
			"CANCLE":"CANCLE"
		}
	}
};


function chooseMain(ts){
	ts=ts instanceof jQuery?ts:undefined;
	var self=ts||$(this),
	     dt=self.attr("data")-0;
	$(".little").css("display","none");
	$(".main1").css({
		"opacity":"1",
		"z-index":"99"
	});
	$(".btns").css("display","none");
	var eles=self.find(".lbtns");
	for(var i=1;i<eles.length+1;i++){
			$("#btn"+i).css("display","inline-block");
	}
	$("#return").css("opacity","1").attr("data","1");
	localReset("last",dt);
}

function returnChoose(){
	var i=$(this).attr("data");
	if(i==0){return;}
	$(".little").css("display","block");
	$(".main1").css({
		"opacity":"0",
		"z-index":"-10"
	});
	$(this).attr("data",0).css("opacity","0");
}


function press(){
	$(this).find("img").attr("src","images/press.png");
}
function release(){
	console.log("big");
	$(".btns img").attr("src","images/unpressed.png");
		// clearKeep();
			var id=$(this).attr("id"),
				num=id.replace("btn",""),
			    code ='(@devcall "{tid}" (control-remote {args}) (lambda (x) x))'
    		.replace("{tid}",tid)
    		.replace("{args}",num);
				console.debug("[CODE] "+code);
				ws.send(code);
				resetKeep();
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
	setTimeout(function(){
         ws.send('(get-state "{tid}")'.replace("{tid}", tid));
     },100)
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
