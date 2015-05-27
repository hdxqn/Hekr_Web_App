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
		//开关开启
		}else if(on>0.5){
			$(this).animate({
				opacity:0.2
			},200,function(){
				$(".circle b").text("关");
			});
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
			return;
		}
		
	}
	//定时开关效果
	function setValue(){
		var id=$(this).attr('id');
		switch(id){
			case 'timer':
			$('.timer i').text($(this).val());
			//定时器改变
			break;
			case 'brightness':
			$('.timer').eq(1).text($(this).val()+'%');
			//亮度调节改变
			break;
			case 'temperature':
			//色温调节改变
			break;
			default:
			break;
		}
	}


})


