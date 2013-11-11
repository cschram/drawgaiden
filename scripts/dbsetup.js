var r     = require( '../node_modules/rethinkdb/rethinkdb' ),
    async = require( '../node_modules/async/lib/async' );

var config = require( '../config' );

console.log("Setting up database...");

r.connect(config.db.rethinkdb, function ( err, conn ) {
    if ( err ) throw err;

    r.dbCreate( config.db.rethinkdb.db ).run(conn, function ( err ) {
        if ( err ) throw err;

        async.parallel([
            function ( callback ) {
                r.tableCreate( 'canvases' ).run( conn, function ( err ) {
                    if ( err ) {
                        callback( err );
                    } else {
                        r.table( 'canvases' ).insert([
                            {
                                id    : 'default',
                                users : []
                            }
                        ]).run(conn, callback);
                    }
                });
            },
            function ( callback ) {
                r.tableCreate( 'history' ).run( conn, function ( err ) {
                    if ( err ) {
                        callback( err );
                    } else {
                        r.table( 'history' ).indexCreate( 'canvas' ).run( conn, callback );
                    }
                });
            },
            function ( callback ) {
                r.tableCreate( 'users' ).run( conn, callback );
            }
        ], function ( err ) {
            if ( err ) throw err;

            console.log("Finished setting up database. You're good to go!");
            conn.close();
        });
    });
});