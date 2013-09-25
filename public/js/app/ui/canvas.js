define([

	'app/app',
	'flight/component',
	'app/mixins/logging',
	'app/tools/pencil',
	'app/tools/rectangle',
	'app/tools/circle'

],
function ( App, Component, Logging, PencilTool, RectangleTool, CircleTool ) {

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
				'circle'    : new CircleTool( this.finalCtx, this.draftCtx )
			};
			this.tool = 'pencil';

			//
			// Functions
			//

			function mouseUp() {
				var tool = self.tools [ self.tool ],
					path = tool.mouseUp();

				// Send to other users
				App.draw({
					tool     : self.tool,
					settings : tool.settings,
					path     : path
				});

				// Clear draft canvas
				self.draftCtx.clearRect( 0, 0, self.draftCtx.canvas.width, self.draftCtx.canvas.height );
			}

			function colorChange( color, type ) {
				for (var name in self.tools) {
					if ( self.tools.hasOwnProperty( name ) ) {
						self.tools[ name ].settings[ type + 'Style' ] = color;
					}
				}
			}

			function draw( tool, path, settings ) {
				self.tools[ tool ].draw( path, settings );
			}


			// Draw initial canvas data
			var canvasData = this.attr.canvasData,
				i          = 0,
				len        = canvasData.length;
			for (; i < len; i++) {
				draw( canvasData[ i ].tool, canvasData[ i ].path, canvasData[ i ].settings );
			}


			//
			// Mouse action event handlers
			//

			this.on( document, 'canvas:mouse:down', function ( e, coord ) {
				this.tools[ this.tool ].mouseDown( coord );
			});

			this.on( document, 'canvas:mouse:up', mouseUp );

			this.on( document, 'canvas:mouse:out', function ( e, coord ) {
				var tool = this.tools[ this.tool ];
				if ( tool.active ) {
					tool.mouseMove( coord );
					mouseUp();
				}
			});

			this.on( document, 'canvas:mouse:move', function ( e, coord ) {
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

			this.on( document, 'actions:clear', function () {
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

		});
	}

	return Component(Canvas, Logging);

});