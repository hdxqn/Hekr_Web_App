$(document).ready(function(){
	touchEvents={};
	browserRedirect(touchEvents);
	$("#direction img").bind(touchEvents.touchstart,press);
	$("#direction img").bind(touchEvents.touchend,release);
	$("#operate img").bind(touchEvents.touchstart,press);
	$("#operate img").bind(touchEvents.touchend,release);
	$(".btn").bind(touchEvents.touchstart,chooseMode);

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

 function press(){
 	var src=$(this).attr("src"),
 		newSrc=src.replace("B","A");
 		$(this).attr("src",newSrc);
 }
 function release(){
 	var src=$(this).attr("src"),
 		newSrc=src.replace("A","B");
 		$(this).attr("src",newSrc);
 }
 function chooseMode(){
 	$(".btn").attr("src","images/Btn.png");
 	$(this).attr("src","images/Atn.png");
 	var id=$(this).attr("id");
 	if(id=="m1"){
 		mode=1;
 	}else if(id=="m2"){
 		mode=2;
 	}
 }
var mode=1;




