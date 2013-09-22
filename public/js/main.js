require.config({

	baseUrl: 'js',

	paths: {

		'flight': 'contrib/flight/lib',
		'socket.io': '/socket.io/socket.io',
		'simplify': 'contrib/simplify-js/simplify',
		'class': 'contrib/class/class'

	}

});

require([

	'app/app',
	'app/ui/tools',
	'app/ui/login',
	'app/ui/canvases',

], function ( App, Tools, Login, Canvases ) {
	
	App.init();

	// Attach components
	Tools.attachTo( '#tools' );
	Login.attachTo( '#user-login' );
	Canvases.attachTo( '#canvases' );

});