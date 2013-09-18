define([

	'app/app',
	'flight/component',
	'app/mixins/logging',
	'app/tools/pencil'

],
function ( App, Component, Logging, PencilTool ) {

	function Canvas() {
		this.defaultAttrs({
			logGroup: 'Canvas'
		});

		this.context = null;
		this.tool    = null;
		this.path    = null;
		this.drawing = false;

		this.after('initialize', function () {
			this.log('Loaded.');
			this.context = this.node.getContext('2d');
			this.tool    = new PencilTool();
			this.path    = [];

			this.on(document, 'canvasMouseDown', function (e, coord) {
				if (!this.drawing) {
					this.drawing = true;
					this.path.push(coord);
				}
			});

			this.on(document, 'canvasMouseUp', function (e, coord) {
				if (this.drawing) {
					this.drawing = false;
					this.path.push(coord);
					this.log('Drawing path.');
					this.tool.draw(this.context, this.path);
					this.path = [];
				}
			});

			this.on(document, 'canvasMouseMove', function (e, coord) {
				if (this.drawing) {
					this.path.push(coord);
				}
			});
		});
	}

	return Component(Canvas, Logging);

});