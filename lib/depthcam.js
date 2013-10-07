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
		var png = new Png(buf, 640, 480, 'gray');
		var png_image = png.encodeSync();

		var filename = './' + new Date().getTime() + '.png';

		fs.writeFileSync(filename, png_image.toString('binary'), 'binary');

		self.emit("depth", filename);
	});

};


module.exports = depthcam;