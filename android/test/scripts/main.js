$(document).ready(function(){

	touchEvents={};
	browserRedirect(touchEvents);
	
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


// var tid = getUrlParam("tid");
// var host = getUrlParam("host") || "device.smartmatrix.mx";

// var token = getUrlParam("access_key");

// var user = getUrlParam("user") || randomString(10);
// var url = "ws://{host}:8080/websocket/t/{user}/code/{token}/user".format({
//   host: host,
//   user: user,
//   token: token
// });
// var ws = new ReconnectingWebSocket(url);




// ws.onmessage = function(e) {
//   console.debug("[RESULT] " + e.data);
//   SEXP.exec(e.data);
// }

// ws.onerror = function() {
//   console.error("[ERROR]");
// }

// ws.onopen = function() {
//   console.debug("[CONNECTED]");
//    ws.send('(get-state "{tid}")'.format({tid:tid}));
// }
// ws.onclose = function() {
//   console.error("[CLOSED]");
// }
// window.changestate=function(data){
// 	receiveState(data.brightness,data.uartdata);
// 	console.debug('[DATA]'+data);
// 	console.debug('[DATA.UARTDATA]'+data.uartdata);
// 	console.debug('[DATA.BRIGHTNESS]'+data.brightness)

// }

