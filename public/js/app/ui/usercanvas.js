define([

	'app/app',
	'flight/component',
	'app/mixins/logging'

],
function ( App, Component, Logging ) {

	function UserCanvas() {
		this.defaultAttrs({
			logGroup : 'UserCanvas'
		});

		this.after('initialize', function () {
			var self = this;

			this.ctx = this.node.getContext( '2d' );
			this.ctx.font = '10pt Arial';

			this.on('users:update', function ( e, data ) {
				this.ctx.clearRect( 0, 0, this.node.width, this.node.height );

				var i = 0,
					len = data.users.length;

				for (; i < len; i++) {
					this.ctx.fillText( data.users[i].name, data.users[i].x, data.users[i].y );
				}
			});

		});
	}

	return Component(UserCanvas, Logging);

});