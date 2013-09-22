define([

	'app/app',
	'flight/component',
	'app/mixins/logging',
	'app/tools/pencil'

],
function ( App, Component, Logging, PencilTool ) {

	function Canvas() {
		this.defaultAttrs({
			logGroup: 'Canvas',
			canvasGroup: document
		});

		this.finalCtx = null;
		this.draftCtx = null;
		this.tool     = null;
		this.path     = null;
		this.drawing  = false;

		this.after('initialize', function () {
			this.finalCtx = this.$node.find('.canvas-final')[0].getContext('2d');
			this.draftCtx = this.$node.find('.canvas-draft')[0].getContext('2d');
			this.tool     = new PencilTool();
			this.path     = [];

			this.on(this.attr.canvasGroup, 'canvasMouseDown', function (e, coord) {
				if (!this.drawing) {
					this.drawing = true;
					this.path.push(coord);
				}
			});

			this.on(this.attr.canvasGroup, 'canvasMouseUp', function (e, coord) {
				if (this.drawing) {
					this.drawing = false;
					this.path.push(coord);
					this.log('Drawing path.');
					this.tool.draw(this.finalCtx, this.path);
					this.path = [];
				}
			});

			this.on(this.attr.canvasGroup, 'canvasMouseMove', function (e, coord) {
				if (this.drawing) {
					this.path.push(coord);
				}
			});
		});
	}

	return Component(Canvas, Logging);

});