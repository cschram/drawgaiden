var Q = require( 'q' ),
	r = require( 'rethinkdb' );

var conn;

exports.connect = function ( config ) {
	return Q.nfcall( r.connect.bind( r ), config ).then(function ( connection ) {
		conn = connection;
		return connection;
	});
};

exports.get = function ( id ) {
	var query = r.table('canvases').get(id);
	return Q.nfcall( query.run.bind( query ), conn );
};

exports.getHistory = function ( id ) {
	function _get( callback ) {
		r.table('history')
			.filter(r.row('canvas').eq(id))
			.orderBy('timestamp')
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

	return Q.nfcall( _get );
};

exports.pushHistory = function ( id, entry ) {
	entry.canvas    = id;
	entry.timestamp = (new Date).getTime();

	var query = r.table('history').insert([entry]);
	return Q.nfcall( query.run.bind( query ), conn );
};

exports.clearUserHistory = function ( id, name ) {
	var query = r.table('history')
		.filter(r.row('canvas').eq(id))
		.filter(r.row('user').eq(name))
		.delete();
	return Q.nfcall( query.run.bind( query ), conn );
};

exports.clearHistory = function ( id ) {
	var query = r.table('history')
		.filter(r.row('canvas').eq(id))
		.delete();
	return Q.nfcall( query.run.bind( query ), conn );
};