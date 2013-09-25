# Get Up And Draw Gaiden: 2

Draw Gaiden is a collaborative drawing web application. With it you can draw on a shared canvas with friends. Using it is easy:

	git clone https://github.com/abjorn/drawgaiden.git
	cd drawgaiden
	npm install
	node drawgaiden.js

You can tweak individual settings in `config.js`.

# Features

* Real-time web-socket collaboration
* Pencil tool allowing you to draw with any color and multiple line widths
* Clear and Save buttons

Currently all of the canvas state is stored in memory in the Node application, so if you kill the process and start it up all of your data is lost.

**Note:** There are two color switchers in the tool bar at the moment. The first is the stroke color, the second is the fill color. Since there is no tool implemented yet that uses the fill color, the second color switcher won't have any effect on anything.

# To Do

* Additional tools
	+ Rectangle
	+ Circle
	+ Eraser
* Cursor overlay showing where each user's cursor is
	+ Undecided whether only while drawing or not
* Persistent storage for canvas data
* Undo stack
* Ability to clear only your work, instead of everyone's
* Chat / action window so users can talk to each other and see users logging in and out

# License

Copyright (c) 2012 Corey Schram

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
