$(document).ready(function(){
	$(".power").bind({click:power,touchend:power});
	$(".clock").bind({click:timer,touchend:timer});
	$(".slider").bind({mouseup:setValue,mousemove:setValue,touchend:setValue,touchmove:setValue});
	var documentWidth=window.screen.availWidth;
	var documentHeight=window.screen.availHeight;
	init();
	function init(){
		if(documentWidth>500){return;}else if(documentWidth<500){
			$('.clock').css({
				marginLeft:10,
				marginRight:10
			});
			if(documentHeight<520){
				$('.main').css('height',documentHeight*2.5);
			console.log(documentHeight);
			}else if(documentHeight<570){
				$('.main').css('height',documentHeight*2);
			console.log(documentHeight);
			}
			
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

	function timer(){
		var on=$(this).css('opacity');
		while(on<0.5){
			$(".clock").css('opacity','0.2');
			$(this).animate({
				opacity:1
			},200);
		if($('.clock').eq(0).css('opacity')>0.5){
			var code = '(@devcall "{tid}" (controltimer 1) (lambda (x) x))'.replace("{tid}", tid);

			ws.send(code);
		}else if($('.clock').eq(0).css('opacity')<0.5){
			var code = '(@devcall "{tid}" (controltimer 0) (lambda (x) x))'.replace("{tid}", tid);

			ws.send(code);
		}
		

			return;
		}
		
	}
	//定时开关效果
	function setValue(){
		var id=$(this).attr('id');
		switch(id){
			case 'timer':
			$('.timer i').text($(this).val());
			var code = '(@devcall "{tid}" (controltimer 1{0}.format($(this).val());) (lambda (x) x))'.replace("{tid}", tid);

			ws.send(code);

			//定时器改变
			break;
			case 'brightness':
			$('.timer').eq(1).text($(this).val()+'%');
			//亮度调节改变
			var code = '(@devcall "{tid}" (controlbrightness 1{0}.format($(this).val());) (lambda (x) x))'.replace("{tid}", tid);

			ws.send(code);
			break;
			case 'temperature':
			//色温调节改变
			var code = '(@devcall "{tid}" (controltemperature 1{0}.format($(this).val());) (lambda (x) x))'.replace("{tid}", tid);

			ws.send(code);
			break;
			default:
			break;
		}
	}


})


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

