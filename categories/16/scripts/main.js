$(document).ready(function(){
	$('#editor').bind({touchstart:ePress,touchend:changeCss});
	$('#cancle').bind({touchstart:bPress,touchend:cancle});
	$('.choice').bind({touchend:choice});
	$('.dp').bind({touchend:bulb});
	$('#btn').bind({touchstart:pPress,touchend:powerChange});
	init();


})

function localSave(tid){

	localStorage.tid=tid;
}

function setJson(arr){

	var json_obj=arr,
	    json_str=JSON.stringify(json_obj);
        
	    localSave(json_str);



}

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

window.changestate=function(data){
	console.debug('[DATA]'+data);
	setLightState(data);
}

function setLightState(data){
	var i=data.tid;
	var j=data.power;
	switch(i){
		case 'ESP_2M_1AFE349C3D01':
		setBulb(j,'#dp1');
		break;
		case 'ESP_2M_1AFE349C3D02':
		setBulb(j,'#dp2');
		break;
		case 'ESP_2M_1AFE349C3D03':
		setBulb(j,'#dp3');	
		break;
		case 'ESP_2M_1AFE349C3D04':
		setBulb(j,'#dp4');
		break;
		case 'ESP_2M_1AFE349C3D05':
		setBulb(j,'#dp5');
		break;
		case 'ESP_2M_1AFE349C3D06':
		setBulb(j,'#dp6');
		break;
		default:
		break;
	}
	
	
}

function setBulb(j,str){
	if(j==1){
			$(str).attr({
				src:'images/deng2.png',
				data:0
			});
		}else if(j==0){
			$(str).attr({
				src:'images/deng.png',
				data:1
			});
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
		var arr1=[];
		$('#btn1').css('opacity','0');
		for(var j=0;j<6;j++){
			if($('.choice').eq(j).attr('data')==0){
				arr1[j]=1;
			}else if($('.choice').eq(j).attr('data')==1){
				arr1[j]=0;
		   }
		   
		}
		setJson(arr1);
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
		tidcode='ESP_2M_1AFE349C3D01';
		break;
		case 'dp2':
		tidcode='ESP_2M_1AFE349C3D02';
		break;
		case 'dp3':
		tidcode='ESP_2M_1AFE349C3D03';
		break;
		case 'dp4':
		tidcode='ESP_2M_1AFE349C3D04';
		break;
		case 'dp5':
		tidcode='ESP_2M_1AFE349C3D05';
		break;
		case 'dp6':
		tidcode='ESP_2M_1AFE349C3D06';
		break;
		default:
		break;
	}

	if(i==1){

		var code ='(@devcall "{tid}" (controlpower {args}) (lambda (x) x))'.format({
			tid:tidcode,
			args:1
			});
		console.debug("[CODE] "+code);
		ws.send(code);


	}else if (i==0) {

		var code ='(@devcall "{tid}" (controlpower {args}) (lambda (x) x))'.format({
			tid:tidcode,
			args:0
		});
		console.debug("[CODE] "+code);
		ws.send(code);
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
function powerSend(id,i){

	var tidcode=null;

	switch(id){
		case 'dp1':
		tidcode='ESP_2M_1AFE349C3D01';
		break;
		case 'dp2':
		tidcode='ESP_2M_1AFE349C3D02';
		break;
		case 'dp3':
		tidcode='ESP_2M_1AFE349C3D03';
		break;
		case 'dp4':
		tidcode='ESP_2M_1AFE349C3D04';
		break;
		case 'dp5':
		tidcode='ESP_2M_1AFE349C3D05';
		break;
		case 'dp6':
		tidcode='ESP_2M_1AFE349C3D06';
		break;
		default:
		break;
	}
	console.debug(id);
	if(i==1){

		var code ='(@devcall "{tid}" (controlpower {args}) (lambda (x) x))'.format({
			tid:tidcode,
			args:1
			});
		console.debug("[CODE] "+code);
		ws.send(code);


	}else if (i==0) {

		var code ='(@devcall "{tid}" (controlpower {args}) (lambda (x) x))'.format({
			tid:tidcode,
			args:0
		});
		console.debug("[CODE] "+code);
		ws.send(code);
	}
	
}

function powerChange(){
	$(this).attr('src','images/powerOn.png');
	var i=$(this).attr('data');
	if (i==1) {
		if(localStorage.tid){
			var arr2=JSON.parse(localStorage.tid);

		for(var j=0;j<arr2.length;j++){
			powerSend('dp'+(j+1),arr2[j]);
		}
		$(this).attr('data',0);
			return;
		}

		localStorage.tid='[1,1,1,1,1,1]';
		for(var k=1;k<=6;k++){
			powerSend('dp'+k,1);
		}
			
	}else if(i==0){
		for(var k=1;k<=6;k++){
			powerSend('dp'+k,0);
		}
		$(this).attr('data',1);
	}
}

var tids=['ESP_2M_1AFE349C3D01','ESP_2M_1AFE349C3D02','ESP_2M_1AFE349C3D03','ESP_2M_1AFE349C3D04',
			'ESP_2M_1AFE349C3D05','ESP_2M_1AFE349C3D06'];
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
   for (var i =0; i <6 ; i++) {
  		console.debug('(get-state "{tid}")'.format({tid:tids[i]}));
   		ws.send('(get-state "{tid}")'.format({tid:tids[i]}));
   }
  
}
ws.onclose = function() {
  console.error("[CLOSED]");
}

