
$(document).ready(function(){
	$("#modal").modal({escapeClose: !1,clickClose: !1,showClose: !1});
	touchEvents={};
	browserRedirect(touchEvents);
	$(".power").bind(touchEvents.touchend,power);
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
		var on=$(this).css('opacity');
		if(on<0.5){
			$(this).animate({
					opacity:1
				},200,function(){
					$(".circle b").text("开");
				});
			var frame=set_power(1);
			var code ='(@devcall "{tid}" (uartdata "{args}") (lambda (x) x))'.format({
					tid:tid,
					args:frame
					});

			ws.send(code);

		//开关开启
		}else if(on>0.5){
			$(this).animate({
				opacity:0.2
			},200,function(){
				$(".circle b").text("关");
			});

			var frame=set_power(0);
			var code ='(@devcall "{tid}" (uartdata "{args}") (lambda (x) x))'.format({
					tid:tid,
					args:frame
					});

		ws.send(code);

		//开关关闭
		}
	}
	//开关点击效果

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
	
	
	var i=$(this).val();
	var frame=set_brightness(i);
	var code ='(@devcall "{tid}" (uartdata "{args}") (lambda (x) x))'.format({
			tid:tid,
			args:frame
			});

	
		ws.send(code);

}

function sendTemperature(){
 
 
	var i=$(this).val();
	var frame=set_temperature(i);
	var code ='(@devcall "{tid}" (uartdata "{args}") (lambda (x) x))'.format({
			tid:tid,
			args:frame
			});

	
		ws.send(code);

}


 
function set_power(value){
//value: 1 open;2 close;
	if(typeof(value)=="number"){
		value = UARTDATA.hex2str(value);
	}else{
		value = parseInt(value,10);
		value = UARTDATA.hex2str(value);
	}
	var data=value+"00000000000000"
	var frame=UARTDATA.encode(0x02,data);

 
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


//console.log(UARTDATA.decode("480B0200030135000000000046"))
