var depthcam = require("../lib/depthcam");

var cowboy = require("../test/cowboy");


var dc = new depthcam();

var boy = new cowboy();

dc.start();


var prev_depth;
var prev_rgb;

var threshold = '70%';
var destination_path = "/Users/troytherrien/Documents/cowboy-test/masked/";



function syncBack(){
	if(typeof prev_depth !== "undefined" && typeof prev_rgb !== "undefined"){
		var depth_filename = prev_depth.substr( prev_depth.lastIndexOf('/')+1 );
		var rgb_filename = prev_rgb.substr( prev_rgb.lastIndexOf('/')+1 );

		console.log('depth_filename: '+ depth_filename);
		if(depth_filename != "undefined.png"){

			if(depth_filename === rgb_filename){
				boy.mask(prev_depth, prev_rgb, destination_path, rgb_filename, threshold);
			}
		}
	}
}


dc.on("depth", function( filepath ){
	console.log('depth written to: ' + filepath + '\n' );
	prev_depth = filepath;
	syncBack();

});

dc.on("rgb", function( filepath ){
	console.log('rgb written to: ' + filepath + '\n' );
	prev_rgb = filepath;
	syncBack();

});