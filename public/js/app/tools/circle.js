define([

	'app/tools/tool',
	'simplify'

],
function ( Tool, simplify ) {

	var CircleTool = Tool.extend({

		_draw: function ( path, ctx ) {
			var radius = Math.sqrt( Math.pow( path[0].x - path[1].x, 2 ) + Math.pow( path[0].y - path[1].y, 2 ) );

			ctx.beginPath();
			ctx.arc( path[0].x, path[0].y, radius, 0, 2 * Math.PI );
			ctx.fill();
			ctx.stroke();
			ctx.closePath();
		},

		mouseDown: function ( coord ) {
			this.active = true;
			this.path   = [ coord, coord ];
		},

		mouseMove: function ( coord ) {
			if ( this.active ) {
				this.path[1] = coord;

				this._resetCtx( this.draftCtx, this.settings, true );
				this._draw( this.path, this.draftCtx );
			}
		},

		draw: function ( path, settings ) {
			settings = settings || this.settings;

			this._resetCtx( this.finalCtx, settings );
			this._draw( path, this.finalCtx );
		}

	});

	return CircleTool;

});