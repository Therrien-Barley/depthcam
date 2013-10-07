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

var depth_flag = true;
var rgb_flag = true;
var timestamp;

depthcam.prototype.start = function(){

	var self = this;

	self.context.resume();

	var interval_id = setInterval(function(){
		depth_flag = true;
		rgb_flag = true;
		timestamp = new Date().getTime(); 
	}, 1000);



	this.context.on('depth', function(buf) {
		if(depth_flag == true){
			depth_flag = false;

			// each depth pixel in buf has 2 bytes, 640 x 480, 11 bit resolution
			var png = new Png(buf, 640, 480, 'gray', 16);
			var png_image = png.encodeSync();

			var filename = '/Users/troytherrien/Documents/cowboy-test/depth/' + timestamp + '.png';

			//fs.writeFileSync(filename, png_image.toString('binary'), 'binary');
			fs.writeFile(filename, png_image.toString('binary'), 'binary', function (err) {
				if (err) throw err;
				//console.log('It\'s saved!');
				self.emit("depth", filename);
			});
		}
	});


	

	this.context.on('video', function(buf) {
		if(rgb_flag == true){
			rgb_flag = false;

			// each rgb pixel in buf has 2 bytes, 640 x 480, 3 channels
			var png = new Png(buf, 640, 480, 'rgb');
			var png_image = png.encodeSync();

			var filename = '/Users/troytherrien/Documents/cowboy-test/rgb/' + timestamp + '.png';

			//fs.writeFileSync(filename, png_image.toString('binary'), 'binary');

			fs.writeFile(filename, png_image.toString('binary'), 'binary', function (err) {
				if (err) throw err;
				//console.log('It\'s saved!');
				self.emit("rgb", filename);
			});
		}
	});


	this.context.start('depth');
	this.context.start('video');

};


module.exports = depthcam;