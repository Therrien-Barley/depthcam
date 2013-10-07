var events = require("events"),
	util = require("util"),
	kinect = require("kinect");



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
			console.log('depth triggered');

			console.dir(buf.toString('base64'));
			fs.writeFile('test.png', buf);
			flag = false;
		}
		

		var filename = 'testfilename.png';//should be the png made from the buffer

		//var image = buf.toString('base64');

		self.emit("depth", filename);
	});

};


module.exports = depthcam;