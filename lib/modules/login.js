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

	            if ( state.canvas.users.hasOwnProperty( name ) ) {
	                delete state.canvas.users[ name ];
	                sock.emit( 'users:update', state.canvas.users );
	            }
	        });
	    });

	    sock.on( 'login', function ( name, done ) {

	        if ( state.canvas.users.hasOwnProperty( name ) ) {

	            done( 'A user with that name is already logged in.' );

	        } else {

	            sock.set( 'name', name, function () {
	                state.canvas.users[ name ] = {
	                    active : false,
	                    x      : 0,
	                    y      : 0
	                };
	                done( null, state.canvas.history );
	            });

	        }

	    });
	}

};