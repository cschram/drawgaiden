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
		this.tools    = null;
		this.tool     = null;
		this.path     = null;
		this.drawing  = false;

		this.after('initialize', function () {
			var finalCanvas = this.$node.find('.canvas-final')[0],
				draftCanvas = this.$node.find('.canvas-draft')[0],
				width       = finalCanvas.width,
				height      = finalCanvas.height;

			// Get contexts
			this.finalCtx = finalCanvas.getContext('2d');
			this.draftCtx = draftCanvas.getContext('2d');

			// Setup tools
			this.tools = {
				'pencil' : new PencilTool( this.finalCtx, this.draftCtx )
			};
			this.tool = 'pencil';

			//
			// Mouse action event handlers
			//
			this.on(document, 'canvas.mouse.down', function ( e, coord ) {
				this.tools[ this.tool ].mouseDown( coord );
			});

			this.on(document, 'canvas.mouse.up', function ( e ) {
				var tool = this.tools [ this.tool ],
					path = tool.mouseUp();

				// Send to other users
				App.draw({
					tool     : this.tool,
					settings : tool.settings,
					path     : path
				});

				// Clear draft canvas
				this.draftCtx.clearRect(0, 0, width, height);
			});

			this.on(document, 'canvas.mouse.move', function ( e, coord ) {
				this.tools[ this.tool ].mouseMove( coord );
			});

			//
			// Drawing event handlers
			//
			this.on('canvas.draw', function ( e, data ) {
				this.tools[ data.tool ].draw( data.path, data.settings );
			});
		});
	}

	return Component(Canvas, Logging);

});