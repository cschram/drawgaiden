define([

	'app/logger'

],
function ( Logger ) {

	function Logging() {
		this.log = function ( message ) {
			Logger.log( this.attr.logGroup || 'Unknown', message );
		};
	}

	return Logging;

});