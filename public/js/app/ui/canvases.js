define([

	'app/app',
	'flight/component',
	'app/mixins/logging',
	'app/ui/canvas',
	'app/ui/usercanvas'

],
function ( App, Component, Logging, Canvas, UserCanvas ) {

	// Some constants for mouse buttons
	var MOUSE_BUTTON_PRIMARY   = 1,
		MOUSE_BUTTON_SCROLL    = 2,
		MOUSE_BUTTON_SECONDARY = 3;


	function Canvases() {
		this.after('initialize', function () {
			var self       = this,
				drawn      = 0,
				$window    = $( window ),
				layerWrap  = this.$node.find( '#layers' ),
				layers     = this.$node.find( '.layer' ),
				active     = false,
				canvasSize = {
					width  : parseInt( layers.find( 'canvas' ).eq(0).attr('width'), 10 ),
					height : parseInt( layers.find( 'canvas' ).eq(0).attr('height'), 10 )
				},
				viewport      = { width : 0, height : 0 },
				mousePos      = { x: 0, y: 0 },
				canvasOffset  = { x : 0, y : 0 },
				maxOffset     = { x : 0, y : 0},
				moveStartTime = 0,
				viewMoving    = false,
				activeLayer   = 0;

			layers.width( canvasSize.width );
			layers.height( canvasSize.height );

			//
			// Resize canvas view
			//
			function resizeView() {
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

				// Canvas is smaller than viewport
				if ( maxOffset.x < 0 || maxOffset.y < 0 ) {

					self.$node.addClass( 'centered' );
					self.$node.css({
						height : canvasSize.height,
						width  : canvasSize.width
					});

					maxOffset = {
						x : 0,
						y : 0
					};
					
				} else {

					self.$node.removeClass( 'centered' );
					self.$node.css({
						height : height,
						width  : '100%'
					});

				}

				return size;
			}

			//
			// Reposition canvases with new view coordinates
			//
			function setCanvasPos( coord ) {
				if ( maxOffset.x > 0 && maxOffset.y > 0 ) {
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
			}

			//
			// Get mouse position calculated from page and canvas offset
			//
			function getMousePos( e ) {
				var off = self.$node.offset();

				mousePos.x = e.pageX;
				mousePos.y = e.pageY;

				return {
					x : e.pageX - off.left + canvasOffset.x,
					y : e.pageY - off.top + canvasOffset.y
				};
			}

			//
			// Move the canvas view
			//
			function moveView( time ) {
				if ( maxOffset.x > 0 && maxOffset.y > 0 ) {
					// Function wasn't called by requestAnimationFrame, make sure it is
					if ( !time ) {
						requestAnimationFrame( moveView );
					}

					if ( !moveStartTime ) {

						moveStartTime = time;

					} else {

						// We need to divide up the time delta since it essentially
						// the speed multiplier, and we don't want the view to move so fast.
						var delta  = ( time - moveStartTime ) / ( 80 * 1000 ),
							offset = self.$node.offset(),
							// mouse position
							pos    = {
								x : mousePos.x - offset.left,
								y : mousePos.y - offset.top
							},
							// position of the middle of the screen
							mid = {
								x : ( viewport.width  / 2 ),
								y : ( viewport.height / 2 )
							};

						// Calculate new canvas view position
						setCanvasPos({
							x : canvasOffset.x + ( ( pos.x - mid.x ) * delta ),
							y : canvasOffset.y + ( ( pos.y - mid.y ) * delta )
						});

					}

					if ( viewMoving ) {
						requestAnimationFrame( moveView );
					} else {
						// Clear starting time when we're done
						moveStartTime = 0;
					}
				}
			}

			this.on( document, 'login:success', function ( e, data ) {
				viewport = resizeView();

				setCanvasPos({
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
			});

			this.on( window, 'resize', function () {
				viewport = resizeView();
				setCanvasPos( canvasOffset );
			});

			this.on( document, 'canvas:drawn', function () {
				drawn++;
				if ( drawn === layers.length ) {
					this.$node.show();
				}
			});

			this.on( document, 'tool:change', function ( e, data ) {
				this.$node.attr( 'class', 'tool-' + data.toolName );
			});

			//
			// Mouse Events
			//

			this.on('mousedown', function ( e ) {
				var p = getMousePos( e );

				e.preventDefault();

				if ( e.which === MOUSE_BUTTON_SCROLL ) {

					viewMoving = true;
					moveView();

				} else {

					active = true;
					App.updateUser( true, p );
					this.trigger( layers.eq( activeLayer ), 'canvas:mouse:down', {
						coord   : p,
						primary : ( e.which === MOUSE_BUTTON_PRIMARY )
					});
				}

				return false;
			});

			this.on('contextmenu', function () {
				return false;
			});

			this.on(document, 'mouseup', function ( e ) {
				if ( e.which === MOUSE_BUTTON_SCROLL ) {

					viewMoving = false;

				} else {

					active = false;
					App.updateUser( false );
					this.trigger( layers.eq( activeLayer ), 'canvas:mouse:up' );

				}
			});
			this.on('mouseenter', function ( e ) {
				var p = getMousePos( e );

				if ( active ) {
					App.updateUser( true, p );

					this.trigger( layers.eq( activeLayer ), 'canvas:mouse:enter', p );
				}
			})
			this.on('mouseout', function ( e ) {
				var p = getMousePos( e );

				if ( active ) {
					App.updateUser( true, p );

					this.trigger( layers.eq( activeLayer ), 'canvas:mouse:out', p );
				}
			});
			this.on(document, 'mousemove', function ( e ) {
				var p = getMousePos( e );

				if ( active ) {
					App.updateUser( true, p );
				}

				this.trigger( layers.eq( activeLayer ), 'canvas:mouse:move', p );
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