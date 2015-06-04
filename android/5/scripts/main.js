function getUrlParam(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
}

var tid = getUrlParam("tid");
var host = getUrlParam("host") || "device.hekr.me";

var token = getUrlParam("access_key");

var user = Math.floor(Math.random() * 100);
var url = "ws://" + host + ":8080/websocket/t/" + user + "/code/" + token + "/user";
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
  ws.send('(get-state "{tid}")'.replace("{tid}", tid));
  $.modal.close();
}
ws.onclose = function() {
  console.error("[CLOSED]");
}


function socketSend(data){
  try{
    ws.send(data);
  }catch(e){}
}

function toggle01(x) {
  return x === 0 ? 1 : 0;
}

function toggle012(x) {
  return x === 2 ? 0 : x + 1;
}

function toggle123(x) {
  return x === 3 ? 1 : x + 1;
}

function buttonKeyUpCSS(id,css){
  $(id)["removeClass"](css);
}

function buttonKeyDownCSS(id,css){
  $(id)["addClass"](css);
}

function buttonCSS(id){
  buttonKeyDownCSS(id,"off");
  setTimeout( 'buttonKeyUpCSS("'+id+'","off")', 200);
}


$(function() {

  var toast = new Toast({
    message: "指令已发送"
  });

  $("#modal").modal({
    escapeClose: false,
    clickClose: false,
    showClose: false
  });

  var codet = '(@devcall "{tid}" ({func} ) (lambda (x) x))'.replace("{tid}", tid);

  $("#back").click(function(e) {
    console.debug("[EVENT] back button clicked");
    window.close();
  });


  $("#funcKai").click(function(e) {
    var code = codet.replace("{func}", "door-open");
    console.debug("[CODE] " + code);
    socketSend(code);
    buttonCSS("#funcKai");
    toast.show();
  });


  $("#funcGuan").click(function(e) {
    var code = codet.replace("{func}", "door-close");
    console.debug("[CODE] " + code);
    socketSend(code);
    buttonCSS("#funcGuan");
    toast.show();
  });


  $("#funcTing").click(function(e) {
    var code = codet.replace("{func}", "door-stop");
    console.debug("[CODE] " + code);
    socketSend(code);
    buttonCSS("#funcTing");
    toast.show();
  });


  $("#funcSuo").click(function(e) {
    var code = codet.replace("{func}", "door-lock");
    console.debug("[CODE] " + code);
    socketSend(code);
    buttonCSS("#funcSuo");
    toast.show();
  });


});
