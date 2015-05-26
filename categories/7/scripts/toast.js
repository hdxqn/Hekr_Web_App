


var Toast = function(config){
	this.context = config.context || $('body');
	this.message = config.message;
	this.time = config.time || 3000;
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

		var left =  this.context.width()/2-msgEntity.find('span').width()/2 ;

		var bottom = '20px' ;
		msgEntity.css({position:'fixed',bottom:bottom,'z-index':'99',left:left,'background-color':'#000000',color:'white','font-size':'14px',padding:'5px',margin:'0px','border-radius':'2px'});
		msgEntity.hide();
	},

	show :function(){
		msgEntity.fadeIn(this.time/2);
		msgEntity.fadeOut(this.time/2);
	}
}
