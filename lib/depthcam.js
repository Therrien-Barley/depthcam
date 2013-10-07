var events = require("events"),
	fs = require("fs"),
	util = require("util"),
	kinect = require("kinect"),
	Png = require("png").Png;



function depthcam( opts ){

	if(typeof opts !== "undefined"){
		if(opts.kinect){
			this.context = kinect( opts.kinect );
		}else{
			this.context = kinect();
		}
	}else{
		this.context = kinect();
	}

		

}

util.inherits( depthcam, events.EventEmitter );


var flag = true;

depthcam.prototype.start = function(){

	var self = this;

	this.context.resume();

	this.context.start('depth');


	this.context.on('depth', function(buf) {
		// each depth pixel in buf has 2 bytes, 640 x 480, 11 bit resolution
		
		if(flag === true){
			flag = false;

			console.log('depth triggered');
			console.dir(buf);
			var png = new Png(buf, 640, 480, 'gray');

			var png_image = png.encodeSync();

			fs.writeFileSync('./png.png', png_image.toString('binary'), 'binary');

			process.exit(1);

		}
		

		var filename = 'testfilename.png';//should be the png made from the buffer

		//var image = buf.toString('base64');

		self.emit("depth", filename);
	});

};


module.exports = depthcam;