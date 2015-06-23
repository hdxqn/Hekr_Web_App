var Toast = function(config){
	this.context = config.context==null?$('body'):config.context;
	this.message = config.message;
	this.time = config.time==null?3000:config.time;
	this.left = config.left;

	this.bottom = config.bottom;
	this.init();
}

var msgEntity;
Toast.prototype = {

	init : function(){
		$("#toastMessage").remove();

		var msgDIV = new Array();
		msgDIV.push('<div id="toastMessage">');
		msgDIV.push('<span>'+this.message+'</span>');
		msgDIV.push('</div>');
		msgEntity = $(msgDIV.join('')).appendTo(this.context);

		var left = this.left == null ? this.context.width()/2-msgEntity.find('span').width()/2 : this.left;

		var bottom = this.bottom == null ? '20px' : this.bottom;
		msgEntity.css({position:'fixed',bottom:bottom,'z-index':'99',left:left,'background-color':'#000000',color:'white','font-size':'14px',padding:'5px',margin:'0px','border-radius':'2px'});
		msgEntity.hide();
	},

	show :function(){
		msgEntity.fadeIn(this.time/2);
		msgEntity.fadeOut(this.time/2);
	}
};
function getUrlParam(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
};



String.prototype.format = function(args) {
  if (arguments.length > 0) {
    var result = this;
    if (arguments.length == 1 && typeof(args) == "object") {
      for (var key in args) {
        var reg = new RegExp("({" + key + "})", "g");
        result = result.replace(reg, args[key]);
      }
    } else {
      for (var i = 0; i < arguments.length; i++) {
        if (arguments[i] == undefined) {
          return "";
        } else {
          var reg = new RegExp("({[" + i + "]})", "g");
          result = result.replace(reg, arguments[i]);
        }
      }
    }
    return result;
  } else {
    return this;
  }
};


function randomString(len) {　　
  len = len || 32;　　
  var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/ 　　
  var maxPos = $chars.length;　　
  var result = '';　　
  for (i = 0; i < len; i++) {
    result += $chars.charAt(Math.floor(Math.random() * maxPos));　　
  }　　
  return result;
};
