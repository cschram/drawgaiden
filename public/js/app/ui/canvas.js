define([

	'app/app',
	'flight/component',
	'app/mixins/logging',
	'app/tools/pencil',
	'app/tools/rectangle',
	'app/tools/circle',
	'app/tools/eraser'

],
function ( App, Component, Logging, PencilTool, RectangleTool, CircleTool, EraserTool ) {

	function Canvas() {
		this.defaultAttrs({
			logGroup    : 'Canvas',
			canvasGroup : document,
			canvasData  : null
		});

		this.finalCtx = null;
		this.draftCtx = null;
		this.tools    = null;
		this.tool     = null;
		this.path     = null;
		this.drawing  = false;

		this.after('initialize', function () {
			var self        = this,
				finalCanvas = this.$node.find('.canvas-final')[0],
				draftCanvas = this.$node.find('.canvas-draft')[0];

			// Get contexts
			this.finalCtx = finalCanvas.getContext('2d');
			this.draftCtx = draftCanvas.getContext('2d');

			// Setup tools
			this.tools = {
				'pencil'    : new PencilTool( this.finalCtx, this.draftCtx ),
				'rectangle' : new RectangleTool( this.finalCtx, this.draftCtx ),
				'circle'    : new CircleTool( this.finalCtx, this.draftCtx ),
				'eraser'    : new EraserTool( this.finalCtx, this.draftCtx )
			};
			this.tool = 'pencil';

			//
			// Functions
			//

			function colorChange( color, type ) {
				for (var name in self.tools) {
					if ( self.tools.hasOwnProperty( name ) ) {
						self.tools[ name ].settings[ type + 'Style' ] = color;
					}
				}
			}

			function togglePrimary( primary ) {
				for ( var name in self.tools ) {
					if ( self.tools.hasOwnProperty( name ) ) {
						self.tools[ name ].settings.primary = primary;
					}
				}
			}

			function draw( tool, path, settings ) {
				self.tools[ tool ].draw( path, settings );
			}


			// Draw initial canvas data
			function redraw( canvasData ) {
				var i   = 0,
					len = canvasData.length;

				self.finalCtx.clearRect( 0, 0, self.finalCtx.canvas.width, self.finalCtx.canvas.height );
				self.draftCtx.clearRect( 0, 0, self.draftCtx.canvas.width, self.draftCtx.canvas.height );

				for (; i < len; i++) {
					draw( canvasData[ i ].tool, canvasData[ i ].path, canvasData[ i ].settings );
				}
			}

			redraw( this.attr.canvasData );


			//
			// Mouse action event handlers
			//

			this.on('canvas:mouse:down', function ( e, data ) {
				togglePrimary( data.primary );
				this.tools[ this.tool ].mouseDown( data.coord );
			});

			this.on('canvas:mouse:up', function ( e, coord ) {
				var tool = this.tools[ this.tool ],
					path = tool.mouseUp();

				// Send to other users
				if ( path.length > 0 ) {
					App.draw({
						tool     : this.tool,
						settings : tool.settings,
						path     : path
					});
				}

				// Clear draft canvas
				this.draftCtx.clearRect( 0, 0, this.draftCtx.canvas.width, this.draftCtx.canvas.height );
			});

			this.on('canvas:mouse:move', function ( e, coord ) {
				this.tools[ this.tool ].mouseMove( coord );
			});

			//
			// Tool event handlers
			//

			this.on( document, 'tool:change', function ( e, data ) {
				if ( this.tools.hasOwnProperty( data.toolName ) ) {
					this.tool = data.toolName;
				}
			});

			this.on( document, 'tool:color:stroke:change', function ( e, data ) {
				colorChange( data.color, 'stroke' );
			});

			this.on( document, 'tool:color:fill:change', function ( e, data ) {
				colorChange( data.color, 'fill' );
			});

			this.on( document, 'tool:size:change', function ( e, size ) {
				for (var name in this.tools) {
					if ( this.tools.hasOwnProperty( name ) ) {
						this.tools[ name ].settings.lineWidth = size;
					}
				}
			});

			//
			// Action event handlers
			//

			this.on( document, 'actions:clear-all', function () {
				self.finalCtx.clearRect( 0, 0, self.finalCtx.canvas.width, self.finalCtx.canvas.height );
				self.draftCtx.clearRect( 0, 0, self.draftCtx.canvas.width, self.draftCtx.canvas.height );
			});

			this.on( document, 'actions:save', function () {
				var data = finalCanvas.toDataURL( 'image/png' );
				window.open( data, '_blank' );
			});

			//
			// Drawing event handlers
			//

			this.on( 'canvas:draw', function ( e, data ) {
				draw( data.tool, data.path, data.settings );
			});

			this.on( document, 'canvas:redraw', function ( e, data ) {
				redraw( data.canvasData );
			});

		});
	}

	return Component(Canvas, Logging);

});