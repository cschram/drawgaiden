var r = require( 'rethinkdb' );

var state = require( '../state' ),
	db    = require( '../db' );

module.exports = {

	sock : null,

	init : function ( conn ) {

	},

	connect : function ( sock ) {
		this.sock = sock;

		sock.on( 'disconnect', function () {
	        sock.get( 'name', function ( e, name ) {
	            if ( e ) {
	                console.error( 'Error getting name: ' + e );
	                return;
	            }

	            if ( state.users.hasOwnProperty( name ) ) {
	                delete state.users[ name ];
	                sock.emit( 'users:update', state.users );
	            }
	        });
	    });

	    sock.on( 'login', function ( name, done ) {

	        if ( state.users.hasOwnProperty( name ) ) {

	            done( 'A user with that name is already logged in.' );

	        } else {

	            sock.set( 'name', name, function () {
	                state.users[ name ] = {
	                    active : false,
	                    x      : 0,
	                    y      : 0
	                };

	                db.getHistory( 'default' ).then(function ( history ) {
	                	done( null, history );
	                });
	            });

	        }

	    });
	}

};