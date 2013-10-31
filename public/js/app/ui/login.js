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
						self.$node.hide();
						self.trigger( document, 'loading:start', {
							done: function () {
								self.trigger( document, 'login:success', {
									canvasData : data
								});
								self.teardown();
							}
						});

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