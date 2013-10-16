define([

	'app/app',
	'flight/component',
	'app/mixins/logging'

],
function ( App, Component, Logging ) {

	function Tools() {
		this.defaultAttrs({
			logGroup: 'Tools'
		});

		this.after('initialize', function () {
			var toolOptions = this.$node.find( '[name=tool]' ),
				strokeColor = this.$node.find( '[name=stroke-color]' ),
				fillColor   = this.$node.find( '[name=fill-color]' ),
				toolSize    = this.$node.find( '[name=size]' );

			this.on( toolOptions, 'change', function () {
				var t = toolOptions.filter(':checked').val();

				this.log('Tool changed to "' + t + '".');

				this.trigger( document, 'tool:change', {
					toolName : t
				})
			});

			this.on( strokeColor, 'change', function () {
				var c = strokeColor.val();

				this.log('Stroke Color changed to "' + c + '".');

				this.trigger( document, 'tool:color:stroke:change', {
					color : c
				});
			});

			this.on( fillColor, 'change', function () {
				var c = fillColor.val();

				this.log('Fill Color changed to "' + c + '".');
				
				this.trigger( document, 'tool:color:fill:change', {
					color : c
				});
			});

			this.on( toolSize, 'change', function () {
				var size = parseInt( toolSize.val(), 10 );

				this.log('Tool Size changed to "' + size + '".');
				
				this.trigger( document, 'tool:size:change', size );
			});
		});
	}

	return Component(Tools, Logging);

});