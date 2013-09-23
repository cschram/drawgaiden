define([

	'app/app',
	'flight/component',
	'app/mixins/logging'

],
function ( App, Component, Logging ) {

	function Actions() {
		this.after('initialize', function () {
			this.on( document, 'login.success', function () {
				this.$node.show();
			});

			this.on( '[name=clear]', 'click', function () {
				this.trigger( document, 'actions.clear' );
				App.clear();
			});

			this.on( '[name=save]', 'click', function () {
				this.trigger( document, 'actions.save' );
			});
		});
	}

	return Component(Actions, Logging);

});