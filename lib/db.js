var async = require( 'async' ),
	r     = require( 'rethinkdb' );

var conn;

exports.connect = function ( config, done ) {
	r.connect(config, function ( err, connection ) {
		conn = connection;
		done( err );
	});
};

exports.get = function ( id, done ) {
	async.parallel([
		function ( callback ) {
			r.table('canvases')
				.get(id)
				.run(conn, function ( err, canvas ) {
					callback( err, canvas );
				});
		},
		function ( callback ) {
			r.table('history')
				.filter(r.row('canvas').eq(id))
				.run(conn, function ( err, cursor ) {
					if ( err ) {
						callback( err );
					} else {
						cursor.toArray(function ( err, history ) {
							callback( err, history );
						});
					}
				});
		}
	], function ( err, results ) {
		if ( err ) {
			done( err );
		}

		var canvas     = results[0];
		canvas.history = results[1];

		done( null, canvas );
	});
};

exports.pushHistory = function ( id, entry ) {
	entry.canvas = id;
	r.table('history')
		.insert([entry])
		.run(conn, function ( err ) {
			if ( err ) throw err;
		});
};

exports.clearUserHistory = function ( id, name ) {
	r.table('history')
		.filter(r.row('canvas').eq(id))
		.filter(r.row('user').eq(name))
		.delete()
		.run(conn, function ( err ) {
			if ( err ) throw err;
		});
};

exports.clearHistory = function ( id ) {
	r.table('history')
		.filter(r.row('canvas').eq(id))
		.delete()
		.run(conn, function ( err ) {
			if ( err ) throw err;
		});
};