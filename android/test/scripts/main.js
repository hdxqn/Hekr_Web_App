$(document).ready(function(){

	touchEvents={};
	browserRedirect(touchEvents);
	$('#sendBtn').bind(touchEvents.touchend,send);
	$('#receiveBtn').bind(touchEvents.touchend,receive);
	$('#slider').bind(touchEvents.touchstart,slider);
	$('#slider').bind(touchEvents.touchend,sendSlider);
	


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

function send(){
	var i=$('#sendText').val();
	
	var code ='(@devcall "{tid}" (uartdata "{args}") (lambda (x) x))'.format({
			tid:tid,
			args:i
			});
		console.debug("[CODE] "+code);
		ws.send(code);
	$('#sendText').val('');
}

function  receiveState(j,i){
	$('#receiveText').val('');
	if(i){
		$('#receiveText').val(i);
	}else{
		$('#receiveText').val('接收数据错误！');
	}
//i为返回的接收信息
	if(j){
		console.log(j);
		$('#showNum').text(j);
		var ret=0.2+(0.8*j/100);
		$('#bulb').attr('data',ret);
		$('#bulb').css('opacity',ret);
		$('#slider').val(j);

	}
//j为接受到的亮度
}

function slider(){
	showSlider();
	$('#slider').bind(touchEvents.touchmove,showSlider);
}

function showSlider(){
	$('#showNum').text($('#slider').val());
	var ret=0.2+(0.8*$('#slider').val()/100);
	$('#bulb').css('opacity',ret);
}

function sendSlider(){
	$('#slider').unbind(touchEvents.touchmove);
	$('#showNum').text('--');
	var ret=$('#bulb').attr('data');
	$('#bulb').css('opacity',ret);
	var i=$(this).val();
	var code ='(@devcall "{tid}" (control {args}) (lambda (x) x))'.format({
			tid:tid,
			args:i
			});
		console.debug("[CODE] "+code);
		ws.send(code);
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
}
ws.onclose = function() {
  console.error("[CLOSED]");
}
window.changestate=function(data){
	console.debug('[DATA]'+data);
	console.debug('[DATA.UARTDATA]'+data.uartdata);
	console.debug('[DATA.DUTY]'+data.duty)
	receiveState(data.duty,data.uartdata);
}


	

	