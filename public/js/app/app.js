define([

	'socket.io',
	'app/logger'

],
function ( io, Logger ) {
	
	var App = {

		socket: null,

		init: function () {
			this.socket = io.connect('/');

			this.socket.on( 'draw', function ( data ) {
				$( document ).trigger( 'io.draw', data );
			});

			this.socket.on( 'clear', function () {
				$( document ).trigger( 'actions.clear' );
			});
		},

		login: function ( name ) {
			var def = $.Deferred();

			this.socket.emit('login', name, function ( err, data ) {
				if (err) {
					def.reject( err );
				} else {
					def.resolve( data );
				}
			});

			return def.promise();
		},

		draw: function ( opts ) {
			this.socket.emit( 'draw', opts );
		},

		clear: function () {
			this.socket.emit( 'clear' );
		}

	};

	return App;

});