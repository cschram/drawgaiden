var dnode = require( 'dnode' );

var db     = require( '../../lib/db' ),
	config = require( '../../config' );

db.connect( config.db.rethinkdb ).then(function () {

	var c = dnode.connect( config.services.flatten.port );

	c.on('remote', function ( remote ) {

		db.getHistory( 'default' ).then(function ( history ) {

			remote.flatten(history, function ( data ) {
				console.log('Flattened: ' + data);
			});
			
		}, function ( err ) {
			throw err;
		});
	});

}, function ( err ) {
	throw err;
});