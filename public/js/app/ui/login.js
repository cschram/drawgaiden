define([

	'app/app',
	'flight/component',
	'app/mixins/logging'

],
function ( App, Component, Logging ) {

	function Login() {
		this.defaultAttrs({
			logGroup: 'Login'
		});

		this.after('initialize', function () {
			var self = this;

			this.$error = this.$node.find('p.error');

			this.on('submit', function ( e ) {
				var name = this.$node.find('input[name="name"]').val();

				e.preventDefault();

				this.$error.text('');

				if (name.length) {
					this.log( 'Logging in with "' + name + '".' );

					App.login( name ).then(function ( data ) {
						self.trigger( document, 'loading:start' );
						self.$node.hide();

						// Trigger off loading view, then delay before calling 'login:success'
						// so we can give the DOM a cycle to render the loading screen.
						setTimeout(function () {
							self.trigger( document, 'login:success', {
								canvasData : data
							});
						}, 10);

						self.teardown();
					}, function ( err ) {
						self.$error.text( err );
					});
				} else {
					this.$error.text( 'Please enter a name' );
				}
			});
		});
	}

	return Component(Login, Logging);

});