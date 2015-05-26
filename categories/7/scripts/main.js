
 function getUrlParam(name) {
     var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if (r != null) return unescape(r[2]);
     return null;
 }

 var toast = new Toast({
     message: "指令已发送"
 });

var tid  = getUrlParam("tid");
var host = getUrlParam("host") || "23.88.239.2";

var token =getUrlParam("access_key") ;

var user = Math.floor(Math.random()*100);
var url  = "ws://"+host+":8080/websocket/t/"+user+"/code/"+token+"/user";
var ws   = new ReconnectingWebSocket(url);


ws.onmessage=function(e){
	console.debug("[WEBSOCKET] "+e.data);
	SEXP.exec(e.data);
};

ws.onerror=function(){
	console.error("[WEBSOCKET] connection error");
};

ws.onopen=function(){
	console.debug("[WEBSOCKET] connection opened");
	ws.send('(get-state "{tid}")'.replace("{tid}",tid));
};
ws.onclose=function(){
	console.error("[WEBSOCKET] connection closed");
};

$(function(){
	$("#power").click(function(e){
		var code ='(@devcall "{tid}" (controlpower {args}) (lambda (x) x))'
    .replace("{tid}",tid)
    .replace("{args}",isPowerOn()?0:1);
		console.debug("[CODE] "+code);
		ws.send(code);
    toast.show();
	});

	$("#timer").on("mouseup touchend",function(e){
		var v = e.target.value;
		console.debug("[EVENT] slider value is "+v);
		var args = v*3600+" "+ (isPowerOn()?0:1);
		var code ='(@devcall "{tid}" (controltimer {args}) (lambda (x) x))'.replace("{tid}",tid).replace("{args}",args);
		timerChange(v);
		console.debug("[CODE] "+code);
		ws.send(code);
	});

  $("#back").click(function(e) {
        console.debug("[EVENT] back button clicked");
        window.close();
    });
});



var isPowerOn=function(){
	return !$("#power").hasClass("off");
};

var powerOn=function(){
	$("#power").removeClass("off");
	$("#powerState").text("开");
	$("#timerState1").text("关闭");
	$("#timerState2").text("关闭");
};

var powerOff=function(){
	$("#power").addClass("off");
	$("#powerState").text("关");
	$("#timerState1").text("开启");
	$("#timerState2").text("开启");
};


var timerChange=function(v){
	$("#timer").val(v);
	$("#time1").text(v);
	$("#time2").text(v);
};


window.changestate=function(o){
	if(o.power!==undefined){
		o.power==0?powerOff():powerOn();
	}
	if(o.timer!==undefined){
		timerChange(Math.floor(o.timer/3600));
	}
};
