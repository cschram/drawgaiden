define([

	'socket.io',
	'app/logger'

],
function ( io, Logger ) {
	
	var App = {

		socket   : null,
		userName : '',

		init: function () {
			this.socket = io.connect('/');

			this.socket.on( 'draw', function ( data ) {
				$( document ).trigger( 'io:draw', data );
			});

			this.socket.on( 'clear', function () {
				$( document ).trigger( 'actions:clear' );
			});

			this.socket.on( 'users:update', function ( data ) {
				$( '#user-canvas' ).trigger( 'users:update', {
					users: data
				});
			});
		},

		login: function ( name ) {
			var self = this,
				def  = $.Deferred();

			this.socket.emit('login', name, function ( err, data ) {
				if (err) {
					def.reject( err );
				} else {
					self.userName = name;

					// XXX: Until I find a better place to put this
					$( 'header ').show();
					
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
		},

		updateUser: function ( active, coords ) {
			coords = coords || { x: 0, y: 0 };
			this.socket.emit('user:update', {
				active : active,
				x      : coords.x,
				y      : coords.y
			});
		}

	};

	return App;

});