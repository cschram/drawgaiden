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
	'app/ui/actions',
	'app/ui/login',
	'app/ui/canvases',

], function ( App, Tools, Actions, Login, Canvases ) {
	
	App.init();

	// Attach components
	Tools.attachTo( '#tools' );
	Actions.attachTo( '#actions' );
	Login.attachTo( '#user-login' );
	Canvases.attachTo( '#canvases' );

});