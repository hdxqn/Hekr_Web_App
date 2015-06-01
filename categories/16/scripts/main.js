$(document).ready(function(){
	$('#editor').bind({touchstart:ePress,touchend:changeCss});
	$('#cancle').bind({touchstart:bPress,touchend:cancle});
	$('.choice').bind({touchend:choice});
	$('.dp').bind({touchend:bulb});
	$('#btn').bind({touchstart:pPress,touchend:powerChange});
	init();


})


	function init(){
		var documentWidth=window.screen.availWidth;
		var documentHeight=window.screen.availHeight;
		if(documentWidth<440){
			$('#btn1').css({
				left:'0',
				margin:'0 0 0 0'
			});
			$('#btn3').css({
				left:'100%',
				margin:'0 0 0 -80px'
			});
		}
		}


//{tid:"ssss",state:{power:1}}
window.changestate=function(data){
	setLightState(data);
}

function setLightState(data){
	var i=data.tid;
	var j=data.state.power;
	switch(i){
		case 'a':
		if(j==1)
		$('#dp1').attr({
				src:'images/deng2.png',
				data:0
			});
		break;
		case 'b':
		if(j==1)
		$('#dp2').attr({
				src:'images/deng2.png',
				data:0
			});
		break;
		case 'c':
		if(j==1)
		$('#dp3').attr({
				src:'images/deng2.png',
				data:0
			});
		break;
		case 'd':
		if(j==1)
		$('#dp4').attr({
				src:'images/deng2.png',
				data:0
			});
		break;
		case 'e':
		if(j==1)
		$('#dp5').attr({
				src:'images/deng2.png',
				data:0
			});
		break;
		case 'f':
		if(j==1)
		$('#dp6').attr({
				src:'images/deng2.png',
				data:0
			});
		break;
		default:
		break;
	}
	
	
}

function changeCss(){
	var i=$(this).attr('data');
	

	if(i==1){
		$('#bulb').find('.choice').css({
	 	opacity: 1,
   		transform:'translate3d(0,0,0) rotate3d(1,1,1,0)'	
	 });
	 $(this).attr('src','images/unchecked.png');
	 $('#btn1').animate({
	 	opacity:1
	 },300);
	 $(this).attr('data',0);
	}else if(i==0){
		$('#btn1').css('opacity','0');
		$('.choice').attr({
			src:'images/circle.png',
			data:1
		});
		$('#editor').attr('src','images/unpressed.png');
		$('#bulb').find('.choice').css({
		opacity: 1,
  		transform:'translate3d(0,10px,0) rotate3d(0,1,0,90deg)'
	});
		 $(this).attr('data',1);
	}

	
	 }

function ePress(){
	$(this).attr('src','images/pressed.png');
}

function bPress(){
	$(this).attr('src','images/unsaved.png');
}
function pPress(){
	$(this).attr('src','images/powerOff.png');
}
	

function cancle(){
	$(this).attr('src','images/saved.png');
	if($(this).parent('#btn1').css('opacity')>0.5){
		$(this).parent('#btn1').css('opacity','0');
		$('.choice').attr({
			src:'images/circle.png',
			data:1
		});
		$('#editor').attr({
			src:'images/unpressed.png',
			data:1
		});
		$('#bulb').find('.choice').css({
		opacity: 1,
  		transform:'translate3d(0,10px,0) rotate3d(0,1,0,90deg)'
	});
	}
}
function choice(){
	var i=$(this).attr('data');
	if(i==1){
		$(this).attr('src','images/dagou.png');
		$(this).attr('data',0);
	}else if(i==0){
		$(this).attr('src','images/circle.png');
		$(this).attr('data',1);
	}
	
}
function bulb(){
	var i=$(this).attr('data');
	var id=$(this).attr('id');
	var tidcode=null;

	switch(id){
		case 'dp1':
		tidcode='a';
		break;
		case 'dp2':
		tidcode='b';
		break;
		case 'dp3':
		tidcode='c';
		break;
		case 'dp4':
		tidcode='d';
		break;
		case 'dp5':
		tidcode='e';
		break;
		case 'dp6':
		tidcode='f';
		break;
		default:
		break;
	}

	if(i==1){
		$(this).attr('src','images/deng2.png');
		$(this).attr('data',0);

		var code ='(@devcall "{tid}" (controlpower {args}) (lambda (x) x))'.format(
{
	tid:tidcode;
	args:1
});
ws.send(code);


	}else if (i==0) {
		$(this).attr('src','images/deng.png');
		$(this).attr('data',1);

				var code ='(@devcall "{tid}" (controlpower {args}) (lambda (x) x))'.format(
{
	tid:tidcode;
	args:0
});
ws.send(code);
	}
	
}

function powerChange(){
	$(this).attr('src','images/powerOn.png');
	var i=$(this).attr('data');
	if (i==1) {
		$('.dp').attr({
				src:'images/deng2.png',
				data:0
			});
	}else if(i==0){
		$('.dp').attr({
				src:'images/deng.png',
				data:1
			});
	}
}

var tids=['a','b','c','d','e','f'];
var host = getUrlParam("host") || "device.hekr.me";
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

