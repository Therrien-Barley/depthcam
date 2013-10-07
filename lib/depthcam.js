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



depthcam.prototype.start = function(){

	var self = this;

	this.context.resume();

	this.context.on('depth', function(buf) {
		// each depth pixel in buf has 2 bytes, 640 x 480, 11 bit resolution
		var png = new Png(buf, 640, 480, 'gray', 16);
		var png_image = png.encodeSync();

		var filename = '../test/depth/' + new Date().getTime() + '.png';

		//fs.writeFileSync(filename, png_image.toString('binary'), 'binary');
		fs.writeFile(filename, png_image.toString('binary'), 'binary', function (err) {
			if (err) throw err;
			//console.log('It\'s saved!');
			self.emit("depth", filename);
		});
	});


	

	this.context.on('video', function(buf) {
		// each rgb pixel in buf has 2 bytes, 640 x 480, 3 channels
		var png = new Png(buf, 640, 480, 'rgb');
		var png_image = png.encodeSync();

		var filename = '../test/rgb/' + new Date().getTime() + '.png';

		//fs.writeFileSync(filename, png_image.toString('binary'), 'binary');

		fs.writeFile(filename, png_image.toString('binary'), 'binary', function (err) {
			if (err) throw err;
			//console.log('It\'s saved!');
			self.emit("video", filename);
		});
	});


	this.context.start('depth');
	//this.context.start('video');

};


module.exports = depthcam;