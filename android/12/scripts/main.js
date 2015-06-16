
$(document).ready(function(){
	$("#modal").modal({escapeClose: !1,clickClose: !1,showClose: !1});
	touchEvents={};
	browserRedirect(touchEvents);
	$('#addtoucharea').bind(touchEvents.touchstart,function(){
		window.close();
	});
	$("#power").bind(touchEvents.touchend,power);
	$("#brightness").bind(touchEvents.touchstart,showBrightness);
	$("#brightness").bind(touchEvents.touchend,sendBrightness);
	$("#temperature").bind(touchEvents.touchend,sendTemperature);
	
	
})


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


 function power(){
		var state=$(this).attr('data');
		if(state==2){
			var frame=set_power(1);
			var code ='(@devcall "{tid}" (uartdata "{args}") (lambda (x) x))'.format({
					tid:tid,
					args:frame
					});

			ws.send(code);
			t.show();

		//开关开启
		}else if(state==1){
			var frame=set_power(0);
			var code ='(@devcall "{tid}" (uartdata "{args}") (lambda (x) x))'.format({
					tid:tid,
					args:frame
					});

		ws.send(code);
		t.show();

		//开关关闭
		}
	}
	//开关点击效果

function setPowerState(e){
	var i=$('#power').attr('data');
	if(e==1&&e!=i){
		$('#power').attr('data',e);
		$('#power').css('opacity','1');
		$(".circle b").text("开");

				
	}else if(e==2&&e!=i){
		$('#power').attr('data',e);
		$('#power').css('opacity','0.2');
		$(".circle b").text("关");
	}	

}

function showBrightness(){
	$('#showBrightness').text($(this).val()+"%");
	$(this).bind(touchEvents.touchmove,moveSlider);
}
function moveSlider(){
	$('#showBrightness').text($(this).val()+"%");
}
function sendBrightness(){
	$(this).unbind(touchEvents.touchmove,moveSlider);
	$('#showBrightness').text('--');
	
	
	var i=$(this).val(),
		frame=set_brightness(i),
	    code ='(@devcall "{tid}" (uartdata "{args}") (lambda (x) x))'.format({
			tid:tid,
			args:frame
			});
		ws.send(code);
		t.show();

}

function setBrightnessState(e){
	$('#brightness').attr('data',e);
	$('#brightness').val(e);
	$('#showBrightness').text(e+'%');
	if(e>0){
		setPowerState(1);
	}
}


function sendTemperature(){
 
 
	var i=$(this).val();
	    frame=set_temperature(i),
	    code ='(@devcall "{tid}" (uartdata "{args}") (lambda (x) x))'.format({
			tid:tid,
			args:frame
			});
		ws.send(code);
		t.show();

}

function setTemperatureState(e){
	$('#temperature').attr('data',e);
	$('#temperature').val(e);
}


 
function set_power(value){
//value: 1 open;2 close;
	if(typeof(value)=="number"){
		value = UARTDATA.hex2str(value);
	}else{
		value = parseInt(value,10);
		value = UARTDATA.hex2str(value);
	}
	var data=value+"00000000000000",
	    frame=UARTDATA.encode(0x02,data);

 
	console.log("set_power      :"+frame.replace(/(\w{2})/g,'$1 ').replace(/\s*$/,''))
	
	return frame;
}


function set_brightness(value){
	if(typeof(value)=="number"){
		value = UARTDATA.hex2str(value);
	}else{
		value = parseInt(value,10);
		value = UARTDATA.hex2str(value);
	}
	var data="0301"+value+"0000000000"
	var frame=UARTDATA.encode(0x02,data);
 
	console.log("set_brightness :"+frame.replace(/(\w{2})/g,'$1 ').replace(/\s*$/,''))
	
	return frame;
}


function set_temperature(value){
	if(typeof(value)=="number"){
		value = UARTDATA.hex2str(value);
	}else{
		value = parseInt(value,10);
		value = UARTDATA.hex2str(value);
	}
	var data="060100"+value+"00000000"
	var frame=UARTDATA.encode(0x02,data);

	console.log("set_temperature :"+frame.replace(/(\w{2})/g,'$1 ').replace(/\s*$/,''))
	
	return frame;
}

function format_frame(frame){ 
	console.log("frame:"+frame.replace(/(\w{2})/g,'$1 ').replace(/\s*$/,''))
}


var tid = getUrlParam("tid");
var host = getUrlParam("host") || "device.smartmatrix.mx";

var token = getUrlParam("access_key");

var user = getUrlParam("user") || randomString(10);
var url = "ws://{host}:8080/websocket/t/{user}/code/{token}/user".format({
  host: host,
  user: user,
  token: token
});
var ws = new ReconnectingWebSocket(url);

var Toast = function(e) {
    this.context = null == e.context ? $("body") : e.context, this.message = e.message, this.time = null == e.time ? 3e3 : e.time, this.left = e.left, this.bottom = e.bottom, this.init()
}, 
msgEntity;
Toast.prototype = {
	init: function() {
        $("#toastMessage").remove();
        var e = new Array;
        e.push('<div id="toastMessage">'), e.push("<span>" + this.message + "</span>"), e.push("</div>"), 
        msgEntity = $(e.join("")).appendTo(this.context);
        var t = null == this.left ? this.context.width() / 2 - msgEntity.find("span").width() / 2 : this.left, n = null == this.bottom ? "20px" : this.bottom;
        msgEntity.css({
        	position: "fixed",
        	bottom: n,"z-index": "99",
        	left: t,"background-color": "#000000",
        	color: "white","font-size": "14px",
        	padding: "5px",
        	margin: "0px",
        	"border-radius": "2px"
        }), 
        msgEntity.hide()
    },
    show: function() {
            msgEntity.stop(true);
        // if(msgEntity.css("display") == "none"){
            msgEntity.fadeIn(this.time / 2);
            msgEntity.fadeOut(this.time / 2) ;  
        // }
       
    }}
var t = new Toast({message: ("命令已发送")});




ws.onmessage = function(e) {
  console.debug("[RESULT] " + e.data);
  SEXP.exec(e.data);
}

ws.onerror = function() {
  console.error("[ERROR]");
}

ws.onopen = function() {
  console.debug("[CONNECTED]");
   ws.send('(get-state "{tid}")'.format({tid:tid}));
  $.modal.close();
}
ws.onclose = function() {
  console.error("[CLOSED]");
}
window.changestate=function(e){
	console.debug("[STATE] ================");
     console.debug(e); 
     console.debug("[STATE] ================");
     console.debug(e.uartdata);
     if(e.tid===tid){
     	var mes=UARTDATA.decode(e.uartdata);
     	console.debug(mes);
     	switch(mes[0]){
     		case 1:
     		 setPowerState(mes[0]);
     		 break;
     		case 2:
     		 setPowerState(mes[0]);
     		 break;
     		case 3:
     		 setBrightnessState(mes[2]);
     		 break;
     		 case 6:
     		 setTemperatureState(mes[3]);
     		 break;
     	} 	
     }
}
	


//console.log(UARTDATA.decode("480B0200030135000000000046"))
