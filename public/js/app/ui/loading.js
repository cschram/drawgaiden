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
                this.$node.fadeIn();
            });

            this.on(document, 'loading:done', function () {
                this.$node.hide();
            });
        });
    }

    return Component(Loading, Logging);

});