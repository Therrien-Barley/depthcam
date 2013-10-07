var events = require("events"),
	util = require("util"),
	spawn = require("child_process").spawn,
	fs = require("fs"),
	exec = require('child_process').exec;

// flag to tell if a process is running
var PROCESS_RUNNING_FLAG = false;



// the process id of the process spawned to take photos/video
var child_process = null;

// Exit strategy to kill child process
// (eg. for timelapse) on parent process exit
process.on('exit', function() {
	if(PROCESS_RUNNING_FLAG){
		child_process.kill();
	}
});

function cowboy() {
	
}

util.inherits( cowboy, events.EventEmitter );

cowboy.prototype.mask = function(depth_imagepath, rgb_imagepath, destination_path, imagename, threshold){
	// depth_imagepath and rgb_imagepath include full paths
	// destination_path has trailing slash
	// threshold: "can be given as a percentage or as an absolute integer value corresponding to the desired channel value."
	// See: http://www.imagemagick.org/script/command-line-options.php#threshold
	//

	console.log('*** cowboy::mask depth_imagepath: '+ depth_imagepath);
	console.log('*** cowboy::mask rgb_imagepath: '+ rgb_imagepath);
	var self = this;

	var gmcommand = "convert";
	var gmargs = depth_imagepath + " -colorspace Gray -write mpr:mask +delete mpr:mask -fuzz 35% -fill white -opaque black -write mpr:mask +delete mpr:mask -threshold " + threshold + " -write mpr:mask +delete mpr:mask -negate -write mpr:mask +delete " + rgb_imagepath + " mpr:mask -alpha Off -compose CopyOpacity -composite " + destination_path + imagename;

	console.log(gmargs);
	//get rid of double spaces
	gmargs = gmargs.replace(/ +(?= )/g,'');
	gmargs = gmargs.split(" ");



	this.child_process = spawn(gmcommand, gmargs);
	child_process = this.child_process;
	PROCESS_RUNNING_FLAG = true	

	this.child_process.stdout.on('data', function (data) {
		console.log('stdout: ' + data);
		dout = data;
	});

	this.child_process.stderr.on('data', function (data) {
		console.log('stderr: ' + data);
		derr = data;
	});

	this.child_process.on('close', function (code) {    
		//emit exit signal for process chaining over time
		self.emit( "exit", destination_path + imagename);

		PROCESS_RUNNING_FLAG = false;
		self.child_process = null;
		child_process = null;
	});


};

module.exports = cowboy;
