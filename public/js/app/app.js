define([

	'app/logger'

],
function ( Logger ) {
	
	var App = {

		init: function () {
			Logger.log('App', 'Initializing...');
		}

	};

	return App;

});