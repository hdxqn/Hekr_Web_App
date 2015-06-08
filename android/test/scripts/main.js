$(document).ready(function(){

	var touchEvents={};
	browserRedirect(touchEvents);
	// init(1);
	$('#sendBtn').bind(touchEvents.touchend,send);
	$('#receiveBtn').bind(touchEvents.touchend,receive);
	$('#slider').bind(touchEvents.touchend,sendSlider);
	$('#slider').bind(touchEvents.touchmove,showSlider);


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

// function init(i){
// 	if (i==1) {
// 		var documentWidth=window.screen.availWidth;
// 		var documentHeight=window.screen.availHeight;
		
// 	};
// }
function send(){
	var i=$('#sendText').val();
	
	var code ='(@devcall "{tid}" (uartdata {args}) (lambda (x) x))'.format({
			tid:tid,
			args:i
			});
		console.debug("[CODE] "+code);
		ws.send(code);
	$('#sendText').val('');
}

function receive(i){
	$('#receiveText').val('');
	if(i){
		$('#receiveText').val(i);
	}else{
		$('#receiveText').val('接收数据错误！');
	}
	
}

function slider(){
	var i=$('#slider').val();
	if(i>0){
		$('#slider').val(0);
	}else if(i==0){
		$('#slider').val(100)
	}
}

function showSlider(){
	$('#showNum').text($(this).val());
	var ret=0.2+(0.8*$(this).val()/255);
	$('#bulb').css('opacity',ret);
}

function sendSlider(){
	$('#showNum').text('--');
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
  sreceive(e.data);
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


	

	