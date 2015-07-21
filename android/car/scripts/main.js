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
        sendMes()
 }
 function release(){
 	var src=$(this).attr("src"),
        dt=$(this).attr("data"),
 		newSrc=src.replace("A","B");
 		$(this).attr("src",newSrc);
        if(mode==1){
            return;
        }else if(mode==2){
            console.log(dt);
            appendContent(dt);
        }
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
    console.log(id+"   "+mode);
 }

function sendMes(mes,bh){
    if(bh==1){
        clearInterval(timer);
        var timer = setInterval(function(){
            console.log("我执行了一次"+str);
        },1000);
    }else if(bh==0){
        clearInterval(timer);
    }
}

var mode=1;
var appendContent = (function(){

    var htmlstr="<i class=\"iconfont\" data={{num}}>{{text}}</i>";
    var eles= document.createElement("i");
    eles.className="iconfont";
    return function(num){
        var str=null;
        switch(num){
            case "1":
            str="&#xe70c;";
            break;
            case "2":
            str="&#xe701;";
            break;
            case "3":
            str="&#xe700;";
            break;
            case "4":
            str="&#xe70b;";
            break;
            case "5":
            str="抬";
            break;
            case "6":
            str="落";
            break;
            case "7":
            str="左";
            break;
            case "8":
            str="右";
            break;
            default:
            break;
        }
        var newcode=htmlstr.replace("{{text}}",str)
                            .replace("{{num}}",num);
        $("#show").append(newcode);
        console.log(newcode);
    };
})();




