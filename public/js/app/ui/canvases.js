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
			var self       = this,
				$window    = $( window ),
				layerWrap  = this.$node.find( '#layers' ),
				layers     = this.$node.find( '.layer' ),
				active     = false,
				canvasSize = {
					width  : parseInt( layers.find( 'canvas' ).eq(0).attr('width'), 10 ),
					height : parseInt( layers.find( 'canvas' ).eq(0).attr('height'), 10 )
				},
				canvasOffset = { x : 0, y : 0 },
				maxOffset    = { x : 0, y : 0};

			this.activeLayer = 0;

			layers.width( canvasSize.width );
			layers.height( canvasSize.height );

			// Resize view
			function resize() {
				var height = $window.height() - 38;

				self.$node.height( height );
				layerWrap.height( height );

				var size = {
					width: $window.width(),
					height: height
				};

				maxOffset = {
					x : canvasSize.width - size.width,
					y : canvasSize.height - size.height
				};

				return size;
			}

			// Reposition canvases
			function positionCanvases( coord ) {
				// Check within bounds
				coord.x = coord.x < 0 ? 0 : coord.x;
				coord.y = coord.y < 0 ? 0 : coord.y;

				coord.x = coord.x > maxOffset.x ? maxOffset.x : coord.x;
				coord.y = coord.y > maxOffset.y ? maxOffset.y : coord.y;

				// Set values
				canvasOffset = coord;
				layers.css( 'left', '-' + coord.x + 'px' );
				layers.css( 'top', '-' + coord.y + 'px' );

				// Notify user canvas of change
				$( document ).trigger( 'canvas:users:reposition', coord );
			}

			function pos( e ) {
				var off = self.$node.offset();
				return {
					x : e.pageX - off.left + canvasOffset.x,
					y : e.pageY - off.top + canvasOffset.y
				};
			}

			this.on( document, 'login:success', function ( e, data ) {
				var viewport = resize();

				positionCanvases({
					x : ( canvasSize.width / 2 ) - ( viewport.width / 2 ),
					y : ( canvasSize.height / 2 ) - ( viewport.height / 2 )
				});

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

			this.on( window, 'resize', function () {
				resize();
				positionCanvases( canvasOffset );
			});

			this.on( document, 'tool:change', function ( e, data ) {
				this.$node.attr( 'class', 'tool-' + data.toolName );
			});

			// Fire off mouse events to 
			this.on('mousedown', function ( e ) {
				var p = pos( e );

				e.preventDefault();

				if ( e.which === 1 ) {
					active = true;
					
					App.updateUser( true, p );

					this.trigger( layers.eq( this.activeLayer ), 'canvas:mouse:down', p );
				}

				return false;
			});
			this.on(document, 'mouseup', function ( e ) {
				if ( e.which === 1)  {
					active = false;

					App.updateUser( false );

					this.trigger( layers.eq( this.activeLayer ), 'canvas:mouse:up' );
				}
			});
			this.on('mouseenter', function ( e ) {
				var p = pos( e );

				if ( active ) {
					App.updateUser( true, p );

					this.trigger( layers.eq( this.activeLayer ), 'canvas:mouse:enter', p );
				}
			})
			this.on('mouseout', function ( e ) {
				var p = pos( e );

				if ( active ) {
					App.updateUser( true, p );

					this.trigger( layers.eq( this.activeLayer ), 'canvas:mouse:out', p );
				}
			});
			this.on(document, 'mousemove', function ( e ) {
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