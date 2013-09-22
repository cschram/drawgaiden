define([

	'app/app',
	'flight/component',
	'app/mixins/logging',
	'app/ui/canvas',
	'app/ui/usercanvas'

],
function ( App, Component, Logging, Canvas, UserCanvas ) {

	function Canvases() {
		this.after('initialize', function () {
			this.on(document, 'loginSuccess', function () {
				// Initialize Layers
				this.$node.find('.layer').each(function () {
					Canvas.attachTo(this, {
						canvasGroup: this.node
					});
				});

				this.$node.show();
			});

			// Fire off mouse events to 
			this.on('mousedown', function (e) {
				this.trigger('canvasMouseDown', {
					x: e.offsetX,
					y: e.offsetY
				});
			});
			this.on('mouseup', function (e) {
				this.trigger('canvasMouseUp', {
					x: e.offsetX,
					y: e.offsetY
				});
			});
			this.on('mousemove', function (e) {
				this.trigger('canvasMouseMove', {
					x: e.offsetX,
					y: e.offsetY
				});
			});
		});
	}

	return Component(Canvases, Logging);

});