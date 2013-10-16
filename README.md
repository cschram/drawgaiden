# Draw Gaiden

Draw Gaiden is a collaborative drawing web application. With it you can draw on a shared canvas with friends. Using it is easy:

	git clone https://github.com/abjorn/drawgaiden.git
	cd drawgaiden
	npm install
	cp config.sample.js config.js
	node drawgaiden.js

You can tweak individual settings in `config.js`.

If you just want to see it in action, you can check out the instance running at http://drawgaiden.com.

# Features

* Real-time web-socket collaboration
* Pencil, Rectangle, Circle, and Eraser
* Displays the location of users cursors while they are drawing
* Clear and Save buttons

Currently all of the canvas state is stored in memory in the Node application, so if you kill the process and start it up all of your data is lost.

# License

Copyright (c) 2012 Corey Schram

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
