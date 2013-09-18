define([

	'class',

],
function ( Class ) {

	var Tool = Class.extend({
		//
		// Default options
		//
		defaults: {
			strokeStyle : '#000',
			fillStyle   : '#000',
			lineWidth   : 1,
			lineCap     : 'round',
			lineJoin    : 'round'
		},

		//
		// Constructor
		//
		init: function (settings) {
			this.settings = $.extend({}, settings, this.defaults);
		},

		//
		// Draw Method
		// The base doesn't do anything but reset context styling, but in
		// child tools this will do the actual rendering.
		//
		draw: function (context) {
			// Reset context styling
			context.strokeStyle = this.settings.strokeStyle;
			context.fillStyle   = this.settings.fillStyle;
			context.lineWidth   = this.settings.lineWidth;
			context.lineCap     = this.settings.lineCap;
			context.lineJoin    = this.settings.lineJoin;
		}
	});

	return Tool;

});