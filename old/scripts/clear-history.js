var r     = require( '../node_modules/rethinkdb/rethinkdb' ),
    async = require( '../node_modules/async/lib/async' );

var config = require( '../config' );

var canvas = 'default';

console.log('Clearing history for canvas "' + canvas + '"...');

r.connect(config.db.rethinkdb, function ( err, conn ) {
    if ( err ) throw err;

    r.table('history').getAll(canvas, { index: 'canvas' }).delete().run(conn, function (err) {
        if ( err ) throw err;
        console.log('Done.');
        conn.close();
    });

});