define([

	'app/app',
	'flight/component',
	'app/mixins/logging'

],
function ( App, Component, Logging ) {

	function Tools() {
		this.after('initialize', function () {
			var toolOptions = this.$node.find( '[name=tool]' ),
				strokeColor = this.$node.find( '[name=stroke-color]' ),
				fillColor   = this.$node.find( '[name=fill-color]' ),
				toolSize    = this.$node.find( '[name=size]' );

			this.on( document, 'login.success', function () {
				this.$node.show();
			});

			this.on( toolOptions, 'change', function () {
				this.trigger( document, 'tool.change', {
					toolName : toolOptions.filter(':checked').val()
				})
			});

			this.on( strokeColor, 'change', function () {
				this.trigger( document, 'tool.color.stroke.change', {
					color : strokeColor.val()
				});
			});

			this.on( fillColor, 'change', function () {
				this.trigger( document, 'tool.color.fill.change', {
					color : fillColor.val()
				});
			});

			this.on( toolSize, 'change', function () {
				this.trigger( document, 'tool.size.change', parseInt( toolSize.val(), 10 ) );
			});
		});
	}

	return Component(Tools, Logging);

});