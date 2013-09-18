define([

	'socket.io',
	'app/logger'

],
function ( io, Logger ) {
	
	var App = {

		socket: null,

		init: function () {
			this.socket = io.connect('/');
		},

		login: function (name) {
			var def = $.Deferred();

			this.socket.emit('login', name, function (err, data) {
				if (err) {
					def.reject(err);
				} else {
					// Do something with data

					def.resolve();
				}
			});

			return def.promise();
		}

	};

	return App;

});