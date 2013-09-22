define([

	'socket.io',
	'app/logger'

],
function ( io, Logger ) {
	
	var App = {

		socket: null,

		init: function () {
			this.socket = io.connect('/');

			this.socket.on('draw', function ( data ) {
				$( document ).trigger( 'io.draw', data );
			});
		},

		login: function ( name ) {
			var def = $.Deferred();

			this.socket.emit('login', name, function ( err, data ) {
				if (err) {
					def.reject(err);
				} else {
					// Do something with data

					def.resolve();
				}
			});

			return def.promise();
		},

		draw: function ( opts ) {
			this.socket.emit( 'draw', opts );
		}

	};

	return App;

});