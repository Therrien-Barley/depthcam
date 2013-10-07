var depthcam = require("../lib/depthcam");



var dc = new depthcam();

dc.start();

dc.on("depth", function( filepath ){
	console.log('image written to: ' + filepath );
});