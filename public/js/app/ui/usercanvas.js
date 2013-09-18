define([

	'app/app',
	'flight/component',
	'app/mixins/logging'

],
function ( App, Component, Logging ) {

	function UserCanvas() {

	}

	return Component(UserCanvas, Logging);

});