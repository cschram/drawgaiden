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
			var layers = this.$node.find( '.layer' );

			function pos( e ) {
				var tp = $(e.target).offset();
				return {
					x : e.pageX - tp.left,
					y : e.pageY - tp.top
				};
			}

			this.on(document, 'login.success', function ( e, data ) {
				// Initialize Layers
				layers.each(function () {
					Canvas.attachTo(this, {
						canvasGroup : this.node,
						canvasData  : data.canvasData || []
					});
				});

				this.$node.show();
			});

			// Fire off mouse events to 
			this.on('mousedown', function (e) {
				this.trigger( document, 'canvas.mouse.down', pos( e ));
			});
			this.on('mouseup', function (e) {
				this.trigger( document, 'canvas.mouse.up' );
			});
			this.on('mouseout', function (e) {
				this.trigger( document, 'canvas.mouse.out', pos( e ));
			});
			this.on('mousemove', function (e) {
				this.trigger( document, 'canvas.mouse.move', pos( e ));
			});


			//
			// IO Events
			//
			this.on( document, 'io.draw', function ( e, data ) {
				var self = this;

				layers.each(function () {
					self.trigger( this, 'canvas.draw', data );
				});
			});
		});
	}

	return Component(Canvases, Logging);

});