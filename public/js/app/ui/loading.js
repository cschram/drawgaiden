define([

	'app/app',
	'flight/component',
	'app/mixins/logging'

],
function ( App, Component, Logging ) {

	function Loading() {
		this.defaultAttrs({
			logGroup: 'Loading'
		});

		this.after('initialize', function () {
			this.on(document, 'loading:start', function ( e, data ) {
				this.log( 'Started.' );
				this.$node.fadeIn( 200, typeof data.done === 'function' ? data.done : undefined );
			});

			this.on(document, 'loading:done', function () {
				this.log( 'Done.' );
				this.$node.hide();
			});
		});
	}

	return Component(Loading, Logging);

});