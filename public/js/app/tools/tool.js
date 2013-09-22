define([

	'class',

],
function ( Class ) {

	var Tool = Class.extend({

		//
		// Default settings
		//
		defaults: {
			strokeStyle : '#000',
			fillStyle   : '#000',
			lineWidth   : 1,
			lineCap     : 'round',
			lineJoin    : 'round'
		},

		// Active flag, determining whether the tool is currently in use
		active    : false,
		// Last coordinate given to the tool during use
		lastCoord : null,
		// Path drawn by the mouse
		path      : null,
		// "Final" context, where the changes are finalized
		finalCtx  : null,
		// "Draft" context, used for displaying temporary tool paths
		// i.e. guide lines for a rectangle tool
		draftCtx  : null,
		// Tool settings
		settings  : null,

		//
		// Constructor
		//
		init: function ( finalCtx, draftCtx, settings ) {
			if (!finalCtx) {
				throw new Error( 'Missing final contexts in tool constructor.' );
			}

			this.finalCtx = finalCtx;
			this.draftCtx = draftCtx;
			this.settings = $.extend( {}, settings, this.defaults );
		},

		//
		// Mouse down method, passed from parent component
		//
		mouseDown: function ( coord ) {
			this.active    = true;
			this.lastCoord = coord;
			this.path      = [ coord ];
		},
		//
		// Mouse up method, passed from parent component
		//
		mouseUp: function () {
			this.active = false;
			this.draw( this.path );
			return this.path;
		},
		//
		// Mouse move method, passed from parent component
		//
		mouseMove: function ( coord ) {
			if (this.active) {
				this.path.push( coord );
			}
		},

		//
		// Reset context styling
		//
		resetCtx: function ( ctx, settings ) {
			// Reset context styling
			ctx.strokeStyle = settings.strokeStyle;
			ctx.fillStyle   = settings.fillStyle;
			ctx.lineWidth   = settings.lineWidth;
			ctx.lineCap     = settings.lineCap;
			ctx.lineJoin    = settings.lineJoin;
		},

		//
		// Draw an arbitrary path
		//
		draw: function ( path, settings ) {
			// No implementation
		}

	});

	return Tool;

});