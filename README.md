# Depthcam

Turn a Kinect into a camera that exports PNG images for both depth and regular RGB images.

## Installation

	npm install depthcam


###  Installing libpng

Depthcam uses the node-png module to convert the Kinect depth and video buffers into PNG images. It's a bit tricky to install for Mac users as Mac OSX before Mountain Lion shipped with the libpng library installed, but we need the development version, so you need to download it and build from source - if you try to use brew or other package managers it will tell you it's already installed.

To install libpng dev for Mac OSX, do:

1.	Download libpng from source forge
2.	Unzip the downloaded file
3.	In Terminal, cd into the directory that you just unzipped, and do the following three things:

	export LDFLAGS='-L/usr/local/opt/libpng/lib'
	export CPPFLAGS='-I/usr/local/opt/libpng/include'
	./configure && make && make install 

This will set the correct flags in your session environment variables so they are referenced when you build libpng from source.