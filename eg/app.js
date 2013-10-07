var depthcam = require("../lib/depthcam");



var dc = new depthcam();

dc.start();

dc.on("depth", function( filepath ){
	console.log('depth written to: ' + filepath + '\n' );
});

dc.on("rgb", function( filepath ){
	console.log('rgb written to: ' + filepath + '\n' );
});