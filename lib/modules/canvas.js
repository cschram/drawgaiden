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

	    sock.on( 'clear', function ( done ) {
	    	sock.get('name', function ( e, name ) {
	    		if ( e ) {
	    			console.error( 'Error getting name: ' + e );
	    			return;
	    		}

		    	// Make a new history list without the users history in it
		    	var hist = [],
		    		i    = 0,
		    		len  = state.canvas.history.length;

		    	for (; i < len; i++) {
		    		if ( state.canvas.history[i].user !== name ) {
		    			hist.push( state.canvas.history[i] );
		    		}
		    	}

		    	state.canvas.history = hist;

		    	// Clear in the database
		    	db.clearUserHistory( state.canvas.id, name );

		    	// Instruct users to redraw with new history
		    	sock.broadcast.emit( 'redraw', state.canvas.history );
		    	done( state.canvas.history );
		    });
	    });

	    sock.on( 'clear-all', function () {
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