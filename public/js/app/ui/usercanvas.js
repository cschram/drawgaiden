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

			this.ctx               = this.node.getContext( '2d' );
			this.ctx.font          = 'bold 11px Helvetica';

			this.on('users:update', function ( e, data ) {
				this.ctx.clearRect( 0, 0, this.node.width, this.node.height );

				var i = 0,
					len = data.users.length,
					user, size;

				for (; i < len; i++) {
					if ( data.users[i].name !== App.userName ) {
						user = data.users[i];
						size = this.ctx.measureText( user.name );

						this.ctx.fillStyle = '#ffffff';
						this.ctx.fillRect(
							user.x - 2,
							user.y - 11,
							size.width + 4,
							15
						);

						this.ctx.fillStyle = '#000000';
						this.ctx.fillText( user.name, user.x, user.y );
					}
				}
			});

		});
	}

	return Component(UserCanvas, Logging);

});