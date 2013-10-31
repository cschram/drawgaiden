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
                colorSwitch = this.$node.find( '[name=color-switch]'),
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
            this.on('tool:color:stroke:set', function ( e, color ) {
                strokeColor.val( color );
                this.trigger( document, 'tool:color:stroke:change', {
                    color : color
                });
            });

            this.on( fillColor, 'change', function () {
                var c = fillColor.val();

                this.log('Fill Color changed to "' + c + '".');
                
                this.trigger( document, 'tool:color:fill:change', {
                    color : c
                });
            });
            this.on('tool:color:fill:set', function ( e, color ) {
                fillColor.val( color );
                this.trigger( document, 'tool:color:fill:change', {
                    color : color
                });
            });

            this.on( colorSwitch, 'click', function ( e ) {
                e.preventDefault();

                var stroke = strokeColor.val(),
                    fill   = fillColor.val();

                strokeColor.val(fill);
                fillColor.val(stroke);

                this.log('Colors switched.');

                this.trigger( document, 'tool:color:stroke:change', {
                    color: fill
                });

                this.trigger( document, 'tool:color:fill:change', {
                    color: stroke
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