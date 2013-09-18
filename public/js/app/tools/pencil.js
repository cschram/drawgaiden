define([

	'app/tools/tool',
	'simplify'

],
function ( Tool, simplify ) {

	var PencilTool = Tool.extend({

		//
		// Draw a series of lines
		// If there are more than two points it will run the points through simplify to improve line
		// fluidity.
		//
		// @param {Context} [context] Canvas context
		// @param {Array} [coords] Array containing objects representing x/y coordinates of line points
		//
		draw: function (context, coords) {
			// Reset styling
			this._super(context);

			// Run through simplify if necessary
			if (coords.length > 2) {
				coords = simplify(coords, 0.8, true);
			}

			// Draw lines
			context.beginPath();
			console.log(coords[0].x + ', ' + coords[0].y);
			context.moveTo(coords[0].x, coords[0].y);
			for (var i = 1, len = coords.length; i < len; i++) {
				console.log(coords[i].x + ', ' + coords[i].y);
				context.lineTo(coords[i].x, coords[i].y);
			}
			context.stroke();
			context.closePath();
		}

	});

	return PencilTool;

});