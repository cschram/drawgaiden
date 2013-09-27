define([

	'app/tools/tool',
	'simplify'

],
function ( Tool, simplify ) {

	var EraserTool = Tool.extend({

		_clearRect: function ( coord, settings ) {
			settings = settings || this.settings;
			this.finalCtx.clearRect( coord.x, coord.y, settings.lineWidth * 2, settings.lineWidth * 2 );
		},

		mouseDown: function ( coord ) {
			this.active    = true;
			this.lastCoord = coord;
			this.path      = [ coord ];
			this._clearRect( coord );
		},
		mouseUp: function () {
			this.active = false;
			return this.path;
		},
		mouseMove: function ( coord ) {
			if (this.active) {
				this.path.push( coord );
				this._clearRect( coord );
			}
		},

		draw: function ( path, settings ) {
			if ( path.length === 0 ) {
				return;
			}

			settings = settings || this.settings;

			var i = 0,
				len = path.length;

			for (; i < len; i++) {
				this._clearRect( path[i], settings );
			}
		}

	});

	return EraserTool;

});