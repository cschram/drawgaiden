define([

	'app/app',
	'flight/component',
	'app/mixins/logging'

],
function ( App, Component, Logging ) {

	function Actions() {
		this.after('initialize', function () {
			this.on( '[name=clear]', 'click', function ( e ) {
				e.preventDefault();
				this.trigger( document, 'actions:clear' );
				App.clear();
			});

			this.on( '[name=save]', 'click', function ( e ) {
				e.preventDefault();
				this.trigger( document, 'actions:save' );
			});
		});
	}

	return Component(Actions, Logging);

});