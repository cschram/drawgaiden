define([

    'app/app',
    'flight/component',
    'app/mixins/logging',

    'app/ui/tools',
    'app/ui/actions',

],
function ( App, Component, Logging, Tools, Actions ) {

    function Header() {
        this.after('initialize', function () {
            Tools.attachTo( '#tools' );
            Actions.attachTo( '#actions' );

            this.on(document, 'loading:done', function () {
                this.$node.show();
            });
        });
    }

    return Component(Header, Logging);

});