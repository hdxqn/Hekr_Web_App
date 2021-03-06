$(document).ready(function(){

	var touchEvents={};
	browserRedirect(touchEvents);
	//$('#editor').bind({touchEvents.touchstart:ePress,touchEvents.touchend:changeCss});
	$('#editor').bind(touchEvents.touchstart,ePress);
	$('#editor').bind(touchEvents.touchend,changeCss);
	// $('#cancle').bind({touchEvents.touchstart:bPress,touchEvents.touchend:cancle});
	$('#cancle').bind(touchEvents.touchstart,bPress);
	$('#cancle').bind(touchEvents.touchend,cancle);
	// $('.choice').bind({touchEvents.touchend:choice});
	$('#bulb').find('.choice').bind(touchEvents.touchend,choice);
	// $('.dp').bind({touchEvents.touchend:bulb});
	$('.dp').bind(touchEvents.touchend,bulb);
	// $('#btn').bind({touchEvents.touchstart:pPress,touchEvents.touchend:powerChange});
	$('#btn').bind(touchEvents.touchstart,pPress);
	$('#btn').bind(touchEvents.touchend,powerChange);
	init(1);


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

function localSave(tid){

	localStorage.tid=tid;
}

function setJson(arr){

	var json_obj=arr,
	    json_str=JSON.stringify(json_obj);
        
	    localSave(json_str);



}

function init(i){

	if(i==1){
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

		if(documentWidth<340){
			$('#bulb').find('.lt1').css({
				left:'0',
				margin:'-40px 0 0 0'
			});
			$('#bulb').find('.lt3').css({
				left:'100%',
				margin:'-40px 0 0 -80px'
			});
		}
		}
		//宽度适配
	}
	

	if(localStorage){
		if(localStorage.tid){
		var arr2=JSON.parse(localStorage.tid);

		for(var j=0;j<arr2.length;j++){
			if(arr2[j]==1){
				$('#choice'+(j+1)).attr({
					src:'images/dagou.png',
					data:0
				});
			}else if(arr2[j]==0){
				$('#choice'+(j+1)).attr({
					src:'images/circle.png',
					data:1
				});
			}
		}
		return;	
	}		
	$('#bulb').find('.choice').attr({
		src:'images/dagou.png',
		data:0
	});
	}else if(!localStorage){
		localStorage={
			tid:'[1,1,1,1,1,1]'
		};

		var arr2=JSON.parse(localStorage.tid);

		for(var j=0;j<arr2.length;j++){
			if(arr2[j]==1){
				$('#choice'+(j+1)).attr({
					src:'images/dagou.png',
					data:0
				});
			}else if(arr2[j]==0){
				$('#choice'+(j+1)).attr({
					src:'images/circle.png',
					data:1
				});
			}
		}
		return;	
		$('#bulb').find('.choice').attr({
		src:'images/dagou.png',
		data:0
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

function changeCss(event){
	var event=event||window.event;
	event.preventDefault();
	var i=$(this).attr('data');
	

	if(i==1){
		init(0);
		$('#bulb').find('.choice').css({
	 	opacity: 1,
   		'transform':'translate3d(0,0,0) rotate3d(1,1,1,0)',
  		'-webkit-transform':'translate3d(0,0,0) rotate3d(1,1,1,0)',
  		'-moz-transform':'translate3d(0,0,0) rotate3d(1,1,1,0)',
  		'-o-transform':'translate3d(0,0,0) rotate3d(1,1,1,0)',
  		'-ms-transform':'translate3d(0,0,0) rotate3d(1,1,1,0)'	
	 });
	 $(this).attr('src','images/unchecked.png');
	 $('#btn1').animate({
	 	opacity:1
	 },300);
	 $(this).attr('data',0);
	}else if(i==0){
		var arr1=[],
		choice=$('#bulb').find('.choice');
		$('#btn1').css('opacity','0');
		for(var j=0;j<6;j++){
			if(choice.eq(j).attr('data')==0){
				arr1[j]=1;
			}else if(choice.eq(j).attr('data')==1){
				arr1[j]=0;
		   }
		   
		}
		setJson(arr1);
		choice.attr({
			src:'images/circle.png',
			data:1
		});
		$('#editor').attr('src','images/unpressed.png');
		choice.css({
		opacity: 1,
  		'transform':'translate3d(0,10px,0) rotate3d(0,1,0,90deg)',
  		'-webkit-transform':'translate3d(0,10px,0) rotate3d(0,1,0,90deg)',
  		'-moz-transform':'translate3d(0,10px,0) rotate3d(0,1,0,90deg)',
  		'-o-transform':'translate3d(0,10px,0) rotate3d(0,1,0,90deg)',
  		'-ms-transform':'translate3d(0,10px,0) rotate3d(0,1,0,90deg)'
	});
		 $(this).attr('data',1);
	}

	
	 }

function ePress(event){
	var event=event||window.event;
	event.preventDefault();
	$(this).attr('src','images/pressed.png');
}

function bPress(event){
	var event=event||window.event;
	event.preventDefault();
	$(this).attr('src','images/unsaved.png');
}
function pPress(event){
	var event=event||window.event;
	event.preventDefault();
	$(this).attr('src','images/powerOff.png');
}
	

function cancle(event){
	var event=event||window.event;
	event.preventDefault();
	$(this).attr('src','images/saved.png');
	if($(this).parent('#btn1').css('opacity')>0.5){
		$(this).parent('#btn1').css('opacity','0');
		
		$('#editor').attr({
			src:'images/unpressed.png',
			data:1
		});
		$('#bulb').find('.choice').css({
		opacity: 1,
  		'transform':'translate3d(0,10px,0) rotate3d(0,1,0,90deg)',
  		'-webkit-transform':'translate3d(0,10px,0) rotate3d(0,1,0,90deg)',
  		'-moz-transform':'translate3d(0,10px,0) rotate3d(0,1,0,90deg)',
  		'-o-transform':'translate3d(0,10px,0) rotate3d(0,1,0,90deg)',
  		'-ms-transform':'translate3d(0,10px,0) rotate3d(0,1,0,90deg)'
	});
	}
}

function choice(event){
	var event=event||window.event;
	event.preventDefault();
	var i=$(this).attr('data');
	if(i==1){
		$(this).attr('src','images/dagou.png');
		$(this).attr('data',0);
	}else if(i==0){
		$(this).attr('src','images/circle.png');
		$(this).attr('data',1);
	}
	
}

function bulb(event){
	var event=event||window.event;
	event.preventDefault();
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

function powerChange(event){
	var event=event||window.event;
	event.preventDefault();
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

