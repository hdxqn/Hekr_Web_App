
$(document).ready(function(){
	$("#modal").modal({escapeClose: !1,clickClose: !1,showClose: !1});
	touchEvents={};
	browserRedirect(touchEvents);
	$(".power").bind(touchEvents.touchend,power);
	$("#brightness").bind(touchEvents.touchstart,showBrightness);
	$("#brightness").bind(touchEvents.touchend,sendBrightness);
	
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
		var code = '(@devcall "{tid}" (controlpower 1) (lambda (x) x))'.replace("{tid}", tid);

		ws.send(code);

		//开关开启
		}else if(on>0.5){
			$(this).animate({
				opacity:0.2
			},200,function(){
				$(".circle b").text("关");
			});

		var code = '(@devcall "{tid}" (controlpower 0) (lambda (x) x))'.replace("{tid}", tid);

		ws.send(code);

		//开关关闭
		}
	}
	//开关点击效果

function showBrightness(){
	$('#showBrightness').text($(this).val()+'--');
	$(this).bind(touchEvents.touchmove,moveSlider);
}
function moveSlider(){
	$('#showBrightness').text($(this).val()+'--');
}
function sendBrightness(){
	$(this).unbind(touchEvents.touchmove,moveSlider);
	$('#showBrightness').text('--');
	var i=$(this).val(),
		code = '(@devcall "{tid}" (controlpower 1) (lambda (x) x))'.replace("{tid}", tid);

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
  $.modal.close();
}
ws.onclose = function() {
  console.error("[CLOSED]");
}

