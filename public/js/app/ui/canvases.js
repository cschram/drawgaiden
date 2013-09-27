define([

	'app/app',
	'flight/component',
	'app/mixins/logging',
	'app/ui/canvas',
	'app/ui/usercanvas'

],
function ( App, Component, Logging, Canvas, UserCanvas ) {

	// TODO: Implement "active" layer, and fire mouse events only on that layer
	
	function Canvases() {
		this.after('initialize', function () {
			var layers = this.$node.find( '.layer' ),
				active = false;

			this.activeLayer = 0;

			function pos( e ) {
				var tp = $(e.target).offset();
				return {
					x : e.pageX - tp.left,
					y : e.pageY - tp.top
				};
			}

			this.on( document, 'login:success', function ( e, data ) {
				// Initialize Layers
				layers.each(function ( i ) {
					Canvas.attachTo(this, {
						id          : i,
						canvasGroup : this.node,
						canvasData  : data.canvasData || []
					});
				});

				this.$node.show();
			});

			this.on( document, 'tool:change', function ( e, data ) {
				this.$node.attr( 'class', 'tool-' + data.toolName );
			});

			// Fire off mouse events to 
			this.on('mousedown', function ( e ) {
				var p = pos( e );

				e.preventDefault();

				active = true;
				
				App.updateUser( true, p );

				this.trigger( layers.eq( this.activeLayer ), 'canvas:mouse:down', p );
			});
			this.on('mouseup', function ( e ) {
				active = false;

				App.updateUser( false );

				this.trigger( layers.eq( this.activeLayer ), 'canvas:mouse:up' );
			});
			this.on('mouseout', function ( e ) {
				if ( active ) {
					active = false;
					App.updateUser( false );

					this.trigger( layers.eq( this.activeLayer ), 'canvas:mouse:out', pos( e ) );
				}
			});
			this.on('mousemove', function ( e ) {
				var p = pos( e );

				if ( active ) {
					App.updateUser( true, p );
				}

				this.trigger( layers.eq( this.activeLayer ), 'canvas:mouse:move', p );
			});


			//
			// IO Events
			//
			this.on( document, 'io:draw', function ( e, data ) {
				var self = this;

				layers.each(function () {
					self.trigger( this, 'canvas:draw', data );
				});
			});
		});
	}

	return Component(Canvases, Logging);

});