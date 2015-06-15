/*
HEKR UARTDATA Protocol analysis
 
 
 智能灯光示例帧：		
 0x48	0x0B	0x02	0x00	

 0x01	0x00	0x64	0x00	0x00	0x00	0x00	0x00

 0XBA

*/

if (typeof UARTDATA !== 'object') {
    UARTDATA = {};
}


(function () {
    'use strict';

	var frame_num=0;
// var frame_header=0x48,
	

    function get_check_code(frame,option) {//frame 帧   option 是否包含校验位
		if(typeof(frame)=="string"){//格式化为数组
			frame=frame.replace(/(\w{2})/g,'$1 ').replace(/\s*$/,'').split(' ');
		}
		var sum=0,i=0;
		for(i in frame){ 
			sum+=parseInt(frame[i],16);	
		}
		if(i){
			sum=sum-0x48;
		}
		if(option){
			//console.log(frame[frame.length-1])
			sum=sum-parseInt(frame[frame.length-1],16);
		}
		if(sum>255){
			sum=sum%0x100
		}
		if(sum<0x10){
			sum='0'+sum.toString(16)
		}else{
			sum=sum.toString(16)
		}
		//console.log("sum(hex)"+sum)
		return sum; 
    }
	
	function hex2str(hex){
		if(hex<0x10){
			hex='0'+hex.toString(16)
		}else{
			hex=hex.toString(16)
		}
		return hex
	}
 
    if (typeof UARTDATA.hex2str !== 'function') {
		
		UARTDATA.hex2str=hex2str;
	};
	

    if (typeof UARTDATA.encode !== 'function') {
 
        UARTDATA.encode = function (frame_type,frame_data) {
			var frame='48';	
			var frame_length=(frame_data.length/2+3);
 
			frame+=hex2str(frame_length);
			frame+=hex2str(frame_type);
			frame+=hex2str(frame_num);
			frame+=frame_data;
			frame+=get_check_code(frame,0)
			frame_num++;
			if(frame_num>0xff){
				frame_num=0;
			}
			return frame; 
        };
    }




    if (typeof UARTDATA.decode !== 'function') {
        UARTDATA.decode = function (frame) {

			var data="";
			if(frame.length<10){
				return ''
			}
			
			//校验合法性
			var frame_check_code=get_check_code(frame,1);
			
			if(frame[frame.length-1]==frame_check_code[frame_check_code.length-1]){
				data=frame.substring(8, frame.length-2)				
				//48 0B 02 00 03 01 35 00 00 00 00 00 46 
			}
			
			return data
			
            //throw new SyntaxError('JSON.parse');
        };
    }
}());