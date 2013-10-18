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
	            state.canvas.history.push( data );
	            db.pushHistory( state.canvas.id, data );
	            sock.broadcast.emit( 'draw', data );
	        });
	    });

	    sock.on( 'clear', function () {
	        state.canvas.history = [];
	        db.clearHistory( state.canvas.id );
	        sock.broadcast.emit( 'clear' );
	    });

	    sock.on('user:update', function ( data ) {
	        sock.get('name', function ( e, name ) {
	            if ( e ) {
	                console.error( 'Error getting name: ' + e );
	                return;
	            }

	            if ( state.canvas.users.hasOwnProperty( name ) ) {
	                state.canvas.users[ name ] = data;

	                // Make an array of active users
	                var d = [];
	                for (var n in state.canvas.users) {
	                    if ( state.canvas.users.hasOwnProperty( n ) && state.canvas.users[ n ].active ) {
	                        d.push({
	                            name : n,
	                            x    : state.canvas.users[ n ].x,
	                            y    : state.canvas.users[ n ].y
	                        });
	                    }
	                }

	                sock.broadcast.emit( 'users:update', d );
	            }
	        });
	    });
	}

};