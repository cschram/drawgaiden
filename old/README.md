# Draw Gaiden

Draw Gaiden is a collaborative drawing web application. With it you can draw on a shared canvas with friends. If you just want to see it in action, you can check out the instance running at http://drawgaiden.com.

Installation is fairly easy in the basic case:

	git clone https://github.com/abjorn/drawgaiden.git
	cd drawgaiden
	git checkout v0.2
	npm install
	cp config.sample.js config.js
	mkdir /var/log/drawgaiden
	node scripts/dbsetup.js
	grunt build
	node drawgaiden.js

It's suggested to use [pm2](https://github.com/Unitech/pm2) to run the server as a daemon:

	pm2 start -i max drawgaiden.js

Check the wiki for more [[Installation]] instructions and [[Configuration]] options.

# Features

* Real-time web-socket collaboration
* Pencil, Rectangle, Circle, Eraser, and Color Picker tools
* Displays the location of users cursors while they are drawing
* Fullscreen canvas
    + Move around the canvas by holding down the middle mouse button
* Clear, Clear All, and Save buttons
* Background services
    + Flatten service merges old history entries into a single image

# Browser Support

Draw Gaiden officially supports the following browsers:

* Chrome >= 30
* Firefox >= 25
* IE >= 10

However, it may work in other versions and other browsers, but there's no guarantee that it will in the future.

# Dependencies [![Build Status](https://david-dm.org/Abjorn/drawgaiden.png)](https://david-dm.org/Abjorn/drawgaiden)

Draw Gaiden requires [Node.js](http://nodejs.org), [RethinkDB](http://www.rethinkdb.com), [Redis](http://redis.io/), as well as the NPM module dependencies listed in `package.json`.

**Note**: You may need to install `libprotobuf` on your machine to build the `node-protobuf` dependency for the RethinkDB driver. If you do not have this installed it should still work, however it's suggested you build with protobuf support.

# License

Copyright (c) 2012 Corey Schram

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
