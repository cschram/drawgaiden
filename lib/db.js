var Q = require( 'q' ),
    r = require( 'rethinkdb' );

var conn;

//
// Connect to RethinkDB
//

exports.connect = function ( config ) {
    var def = Q.defer();

    r.connect( config, function ( err, connection ) {
        if ( err ) {
            def.reject( err );
            return;
        }

        conn = connection;

        r.table('canvases').get('default')
            .update({ users: r.literal([]) })
            .run(conn, function ( err ) {
                if ( err ) {
                    def.reject( err );
                    return;
                }

                def.resolve();
            });
    });

    return def.promise;
};

///////////////////////////////////////////////////////////////
// Canvas Operations
///////////////////////////////////////////////////////////////

exports.getCanvas = function ( id, full ) {
    if ( full ) {
        return this.getCanvasFull( id );
    } else {
        var query = r.table('canvases').get(id);
        return Q.nfcall( query.run.bind( query ), conn );
    }
};

exports.getCanvasFull = function ( id ) {
    var def = Q.defer();

    r.table('canvases').getAll(id)
        .map(function ( canvas) {
            return canvas.merge({
                users   : r.table('users').filter(r.row('canvases').contains(id)),
                history : r.table('history').getAll({ canvas: id }).orderBy('timestamp')
            });
        })
        .run(conn, function ( err, cursor ) {
            if ( err ) {
                def.reject( err );
                return;
            }

            cursor.toArray(function ( err, result ) {
                if ( err ) {
                    def.reject( err );
                    return;
                }

                def.resolve( result[0] );
            });
        });

    return def.promise;
};

///////////////////////////////////////////////////////////////
// User Operations
///////////////////////////////////////////////////////////////

exports.userInCanvas = function ( name, canvas ) {
    var def = Q.defer();

    r.table('canvases').get(canvas).run(conn, function ( err, canvas ) {
        if ( err ) {
            def.reject( err );
            return;
        }

        def.resolve( canvas.users.indexOf( name ) > -1 );
    });

    return def.promise;
};

exports.addUser = function ( name, canvas ) {
    var query = r.table('canvases').get(canvas)
        .update({ users: r.row('users').append(name) });
    return Q.nfcall( query.run.bind( query ), conn );
};

exports.removeUser = function ( name, canvas ) {
    var query = r.table('canvases').get(canvas)
        .update({ users: r.row('users').difference([name]) })
    return Q.nfcall( query.run.bind( query ), conn );
};

///////////////////////////////////////////////////////////////
// History Operations
///////////////////////////////////////////////////////////////

exports.getHistory = function ( id ) {
    var def = Q.defer();

    r.table('history')
        .getAll(id, { index : 'canvas' })
        .orderBy('timestamp')
        .run(conn, function ( err, cursor ) {
            if ( err ) {
                def.reject( err );
                return;
            }

            cursor.toArray(function ( err, history ) {
                if ( err ) {
                    def.reject( err );
                    return;
                }

                def.resolve( history );
            });
        });

    return def.promise;
};

exports.pushHistory = function ( id, entry ) {
    entry.canvas    = id;
    entry.timestamp = entry.timestamp || Date.now();

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

exports.deleteNHistoryEntries = function ( id, n ) {
    var query = r.table('history')
            .getAll(id, { index : 'canvas' })
            .orderBy('timestamp')
            .limit(n)
            .delete();
    return Q.nfcall( query.run.bind( query ), conn );
};