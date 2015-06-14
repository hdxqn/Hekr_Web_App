$(document).ready(function(){
	$("#modal").modal({escapeClose: !1,clickClose: !1,showClose: !1});
	touchEvents={};
	browserRedirect(touchEvents);
	$('#sendBtn').bind(touchEvents.touchend,send);
	$('#receiveBtn').bind(touchEvents.touchend,receive);
	$('#slider').bind(touchEvents.touchstart,slider);
	$('#slider').bind(touchEvents.touchend,sendSlider);
	$('#sendText').focus(clearText);
	$('#sendText').keydown(submit);
	$('#xian1').bind(touchEvents.touchstart,putFocus);
	$('#xian2').bind(touchEvents.touchstart,putFocus);
	$('#back').bind(touchEvents.touchstart,function(){
		window.close();
	});
	var loginfo_height=$(document.body).height()-$('#bottom').offset().top;
	$('#loginfo').css('height', loginfo_height);
	$("#show_url").on('click', function(e){ 
		$('#url').toggle();
		$('#loginfo').hide();
	})
	
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

 function clearText(){
 	$(this).val('');
 }

function putFocus(event){
	var event=event||window.event;
	event.preventDefault();
	var id=$(this).attr('id');
	if(id=='xian1'){
		$('#sendText').focus();
	}else if(id=='xian2'){
		$('#receiveText').focus();
	}
}
function submit(event){
	if(event.keyCode==13){
		send();
	}
}

function send(){
	var i=$('#sendText').val();
	i=i.replace(/ /g,'');
	if((i.length%2)==0){
		var code ='(@devcall "{tid}" (uartdata "{args}") (lambda (x) x))'.format({
			tid:tid,
			args:i
			});
		console.debug("[CODE] "+code);
		ws.send(code);
		log(i,"Send");
	}else{
			if($('#remindMes').css('opacity')<0.1){
				$('#remindMes').animate({
				opacity:1
			},1500);
			$('#remindMes').animate({
			opacity:0
			},1500);
			}
		}
	
}

function  receiveState(j,i){
	$('#receiveText').val('');
	if(i){
		var formate_data=i.replace(/(\w{2})/g,'$1 ').replace(/\s*$/,'');
		$('#receiveText').val(formate_data);
		log(i,"Receive");
	}
//i为返回的接收信息
	if(j || j==0){
		$('#slider').val(j);
		$('#showNum').text(j);
		var ret=0.2+(0.8*j/100);
		$('#bulb').attr('data',ret);
		$('#bulb').css('opacity',ret);
	}
//j为接受到的亮度
}

function slider(){
	// showSlider();
	$('#slider').bind(touchEvents.touchmove,showSlider);
	$('#slider').bind(touchEvents.touchstart,showSlider);
}

function showSlider(){
	$('#showNum').text($(this).val());
	var ret=0.2+(0.8*$(this).val()/100);
	$('#bulb').css('opacity',ret);
}

function sendSlider(){
	$(this).unbind(touchEvents.touchmove);
	$(this).bind(touchEvents.touchstart);
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


function receive(){
	var i=$(this).attr('data');
	if(i==0){
		$(this).css({
		 'transform': 'rotate3d(0,0,1,180deg)',
 		'-webkit-transform': 'rotate3d(0,0,1,180deg)',
 		'-moz-transform': 'rotate3d(0,0,1,180deg)',
 		'-ms-transform': 'rotate3d(0,0,1,180deg)',
 		'-o-transform': 'rotate3d(0,0,1,180deg)'
	});
		$(this).attr('data',1);
	}else if(i==1){
		$(this).css({
		 'transform': 'rotate3d(0,0,1,0)',
 		'-webkit-transform': 'rotate3d(0,0,1,0)',
 		'-moz-transform': 'rotate3d(0,0,1,0)',
 		'-ms-transform': 'rotate3d(0,0,1,0)',
 		'-o-transform': 'rotate3d(0,0,1,0)'
	});
		$(this).attr('data',0);
	}
	
	$('#loginfo').toggle();
	$('#url').hide();
	
}

function getLocalTime() {
   return new Date().toLocaleString().replace(/:\d{1,2}$/,' ');       
} 

function log(data,type){	
	var formate_data=data.replace(/(\w{2})/g,'$1 ').replace(/\s*$/,'');
	$('#loginfo').append('<li><span>'+type+' ['+data.length+']  </span> '+getLocalTime()+'<br /><span>'+formate_data+'</span></li>');
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
  $.modal.close();
   ws.send('(get-state "{tid}")'.format({tid:tid}));
}
ws.onclose = function() {
  console.error("[CLOSED]");
}
window.changestate=function(data){
	console.debug('[DATA]'+data);
	console.debug('[DATA.UARTDATA]'+data.uartdata);
	console.debug('[DATA.BRIGHTNESS]'+data.brightness)
	receiveState(data.brightness,data.uartdata);
}


