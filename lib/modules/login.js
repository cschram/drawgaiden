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

	            var i = state.users.indexOf( name );
	            if ( i > -1 ) {
	                state.users.splice( i, 1 );
	                sock.broadcast.emit( 'user:update', {
	                	name   : name,
	                	active : false
	                });
	            }
	        });
	    });

	    sock.on( 'login', function ( name, done ) {

	        if ( state.users.indexOf ( name ) > -1 ) {

	            done( 'A user with that name is already logged in.' );

	        } else {

	            sock.set( 'name', name, function () {
	            	state.users.push( name );
	            	
	                db.getHistory( 'default' ).then(function ( history ) {
	                	done( null, history );
	                });
	            });

	        }

	    });
	}

};