var r = require( 'rethinkdb' );

var state = require( '../state' ),
    db    = require( '../db' );

module.exports = {

    sock : null,

    init : function () {

    },

    connect : function ( sock ) {
        this.sock = sock;

        sock.on( 'draw', function ( data ) {
            sock.get('name', function ( e, name ) {
                if ( e ) {
                    console.error( 'Error getting name: ' + e );
                    return;
                }

                data.user = name;
                db.pushHistory( 'default', data );
                sock.broadcast.emit( 'draw', data );
            });
        });

        sock.on( 'clear', function ( done ) {
            sock.get('name', function ( e, name ) {
                if ( e ) {
                    console.error( 'Error getting name: ' + e );
                    return;
                }

                db.getHistory( 'default' ).then(function ( history ) {

                    // Make a new history list without the users history in it
                    var hist = [],
                        i    = 0,
                        len  = history.length;

                    for (; i < len; i++) {
                        if ( history[i].user !== name ) {
                            hist.push( history[i] );
                        }
                    }

                    // Clear in the database
                    db.clearUserHistory( 'default', name );

                    // Instruct users to redraw with new history
                    sock.broadcast.emit( 'redraw', hist );
                    done( hist );

                });
            });
        });

        sock.on( 'clear-all', function () {
            db.clearHistory( 'default' );
            sock.broadcast.emit( 'clear' );
        });

        sock.on('user:update', function ( data ) {
            sock.get('name', function ( e, name ) {
                if ( e ) {
                    console.error( 'Error getting name: ' + e );
                    return;
                }

                data.name = name;
                sock.broadcast.emit( 'user:update', data );
            });
        });
    }

};