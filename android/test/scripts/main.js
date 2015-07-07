$(document).ready(function(){

	touchEvents={};
	browserRedirect(touchEvents);
	changeMain_0();
    // rollAnimation();
	switchBg(1);
    $('#main').bind('mousewheel',function(event,delta){
        switchMain(delta);
    });
    $('.turn_box').bind(touchEvents.touchend,flip);
    // $('#main').bind('touchstart',function(event){
    //     startPos=event.touches[0].pageY;
    // });
    // $('#main').bind('touchmove',function(event){
    //     var delta = event.touches[0].pageY-startPos;
    //     if(delta>30){
    //         switchMain(1);
    //         startPos=event.touches[0].pageY;
    //     }else if(delta<-30){
    //         switchMain(-1);
    //         startPos=event.touches[0].pageY;
    //     }
        
    // });
    // $('#main').bind('touchend',function(event){
    //     var delta = event.touches[0].pageY-startPos;
    //     if(delta>30){
    //         switchMain(1);
    //         startPos=event.touches[0].pageY;
    //     }else if(delta<-30){
    //         switchMain(-1);
    //         startPos=event.touches[0].pageY;
    //     }
        
    // });
    document.getElementById('main').addEventListener("touchstart",function(event){
        startPos=event.touches[0].pageY;
    });
     document.getElementById('main').addEventListener("touchmove",function(event){
      // event.preventDefault();
    });
      document.getElementById('main').addEventListener("touchend",function(event){
        var delta = event.changedTouches[0].pageY-startPos;
        if(delta>30){
            switchMain(1);
            startPos=event.changedTouches[0].pageY;
        }else if(delta<-30){
            switchMain(-1);
            startPos=event.changedTouches[0].pageY;
        }
    });
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

 function flip(){
    var elef=null,
        eleb=null;
    $(this).find('.turn_img').each(function(){
        if ($(this).hasClass('out')) {
            eleb=$(this);
        }else{
            elef=$(this);
        }
    });

     $(elef).addClass("out").removeClass("in");
    setTimeout(function() {
        $(eleb).addClass("in").removeClass("out");
    }, 300);

 }


function rollAnimation(){
    setInterval(function(){
        $('#roll').addClass('roll_0');
        setTimeout(function(){
        $('#roll').removeClass('roll_0');
        },1000);
    },1500);
  
}


 function changNav(){
 	var common=$(".common"),
 		main=null,
 		nav=$('#nav');
 	for(var i=0;i<common.length;i++){
 		if($(common[i]).css('top')=='0px'){
 			main=common[i].id.replace('main_','');
 			break;
 		}
 	}
    if(main==0){
        $(nav).css('display','block');
    }else{
        $(nav).css('display','none');
    }
    return main;
 }

 function changeMain_0(){
 	$('.hekrlogo').addClass('hekrlogo_0');
 	$('.title_1').addClass('title_0');
 	$('.title_2').addClass('title_0');
 	$('.title_3').addClass('title_0');
 	$('.more').addClass('more_0');
 }
 function removeMain_0(){
    $('.hekrlogo').removeClass('hekrlogo_0');
    $('.title_1').removeClass('title_0');
    $('.title_2').removeClass('title_0');
    $('.title_3').removeClass('title_0');
    $('.more').removeClass('more_0');
 }
 function jumpToNum(num){
    // for(var i=0;i<4;i++){
    //     setTimeout(function(){
    //          $('#main_'+i).addClass('common_up');
    //           $('#main_'+i).removeClass('common_down');
    //     },200);
    // }
    var i=0;
    var j=setInterval(function(){
        $('#main_'+i).addClass('common_up');
        $('#main_'+i).removeClass('common_down');
       i<num?i+=1:i+=0;
    },200);
    setTimeout(function(){
        $('#nav').css('display','none');
     $('#main_'+num).removeClass('common_down');
        $('#main_'+num).removeClass('common_up');
        clearInterval(j);
    },200*num+200);
    
        switchMain(num,1);
 }


var switchMain=(function(){
    var currentPage=changNav(),
        oldTime=new Date();

    return function(num,jump){
        var nextDown=currentPage-1,
            nextUp=currentPage-0+1,
            newTime=new Date();
   
    if(num<0&&jump==undefined){
        if(nextUp>6){
            return;
        }
        var interVal=newTime-oldTime;
        if(interVal>600){
            nextUp==0?$('#nav').css('background-color','transparent'):$('#nav').css('background-color','transparent');
        $('#main_'+nextUp).removeClass('common_down');
        $('#main_'+nextUp).removeClass('common_up');
        $('#main_'+currentPage).addClass('common_up');
        currentPage=currentPage>=6?currentPage-0:currentPage-0+1;
        oldTime=newTime;
        }
           
    }else if(num>0&&jump==undefined){
         if(nextDown<0){
            
            return;
        }
        var interVal=newTime-oldTime;
        if(interVal>600){
             nextDown==0?$('#nav').css('background-color','transparent'):$('#nav').css('background-color','transparent');
        $('#main_'+nextDown).removeClass('common_down');
        $('#main_'+nextDown).removeClass('common_up');
        $('#main_'+currentPage).addClass('common_down');
       currentPage=currentPage<=0?currentPage:currentPage-1;
       oldTime=newTime;
        }
        
    }else if(jump){
        currentPage=num;
    }
    };
})();

var switchBg = (function(){
    var last_num = 1;
    return function(num){
        var showBg=$('#main_5_show_bg'),
            testNum=Math.random();
            if(testNum<0.5){
                $('.main_5_bm').addClass('main_5_bm_0');
                $('#main_5_show'+num).removeClass('main_5_bm_0').removeClass('main_5_bm_1');
            }else if(testNum>=0.5){
                $('.main_5_bm').addClass('main_5_bm_1');
                $('#main_5_show'+num).removeClass('main_5_bm_0').removeClass('main_5_bm_1');
            }
        $('.main_5_bm').addClass('main_5_bm_0');
        $('.little_button').removeClass('little_button_selected');
        $('#main_5_show'+num).removeClass('main_5_bm_0');
        $('#button_'+num).addClass('little_button_selected');
        
        switch(last_num){
            case 1:
            showBg.attr('src','images/livingroom.jpg');
            break;
            case 2:
            showBg.attr('src','images/kitchen.jpg');
            break;
            case 3:
            showBg.attr('src','images/bedroom.jpg');
            break;
            case 4:
            showBg.attr('src','images/bathroom.jpg');
            break;
            case 5:
            showBg.attr('src','images/yard.jpg');
            break;
            default:
            break;
        }
        last_num = num;
    };
})();

var showTechtitle=(function(){
    var last_num=1;
    return function(ts,num){
         $('.main_6_bt_a').removeClass('main_6_button_selected');
        $(ts).addClass('main_6_button_selected');
        $('.main_6_tb').removeClass('main_6_tb_0');
        $('#main_6_tb'+num).addClass('main_6_tb_0');
        // 标题切换
        resetImg(last_num);
        var elArr=$('.main_6_btn_'+num);
        if(elArr.length>2){
            $(elArr[0]).removeClass('main_6_img_l');
            $(elArr[1]).removeClass('main_6_img_l');
            $(elArr[2]).removeClass('main_6_img_r');
            $(elArr[3]).removeClass('main_6_img_r');
        }else if(elArr.length<=2){
            $(elArr[0]).removeClass('main_6_img_l');
            $(elArr[1]).removeClass('main_6_img_r');
        }
        last_num=num;
    };
})();
var startPos=0;

// function debounce(func, wait, immediate) { 
//     var timeout; 
//     return function() { 
//         var context = this, args = arguments; 
//         var later = function() { 
//             timeout = null; 
//             if (!immediate) func.apply(context, args); 
//         }; 
//         var callNow = immediate && !timeout; 
//         clearTimeout(timeout); 
//         timeout = setTimeout(later, wait); 
//         if (callNow) func.apply(context, args); 
//     }; 
// }; 
 

 
// var myEfficientFn = debounce(function(delta) { 
        
//     switchMain(delta);
 
// },600); 

function resetImg(num){
    var elArr=$('.main_6_btn_'+num);
        if(elArr.length>2){
            $(elArr[0]).addClass('main_6_img_l');
            $(elArr[1]).addClass('main_6_img_l');
            $(elArr[2]).addClass('main_6_img_r');
            $(elArr[3]).addClass('main_6_img_r');
        }else if(elArr.length<=2){
            $(elArr[0]).addClass('main_6_img_l');
            $(elArr[1]).addClass('main_6_img_r');
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

