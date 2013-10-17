var r     = require( '../node_modules/rethinkdb/rethinkdb' ),
	async = require( '../node_modules/async/lib/async' );

var config = require( '../config' );

console.log("Setting up database...");

r.connect(config.dbconfig, function ( err, conn ) {
	if ( err ) throw err;

	r.dbCreate( config.dbconfig.db ).run(conn, function ( err ) {
		if ( err ) throw err;

		async.parallel([
			function ( callback ) {
				r.tableCreate( 'canvases' ).run( conn, callback );
			},
			function ( callback ) {
				r.tableCreate( 'history' ).run( conn, callback );
			}
		], function ( err, results ) {
			if ( err ) throw err;

			r.table( 'canvases' ).insert([
				{
					id: "default"
				}
			]).run(conn, function ( err ) {
				if ( err ) throw err;
				console.log("Finished setting up database. You're good to go!");
				conn.close();
			});
		});
	});
});