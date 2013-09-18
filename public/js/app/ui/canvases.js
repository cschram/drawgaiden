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
				Canvas.attachTo('#canvas');
				UserCanvas.attachTo('#user-canvas');
				this.$node.show();
			});

			this.on('mousedown', function (e) {
				this.trigger(document, 'canvasMouseDown', {
					x: e.offsetX,
					y: e.offsetY
				});
			});
			this.on('mouseup', function (e) {
				this.trigger(document, 'canvasMouseUp', {
					x: e.offsetX,
					y: e.offsetY
				});
			});
			this.on('mousemove', function (e) {
				this.trigger(document, 'canvasMouseMove', {
					x: e.offsetX,
					y: e.offsetY
				});
			});
		});
	}

	return Component(Canvases, Logging);

});