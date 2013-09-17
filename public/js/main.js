require.config({

	baseUrl: 'js'

});

require([

	'app/app'

], function ( App ) {
	
	App.init();

});