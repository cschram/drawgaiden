define([

    'app/app',
    'flight/component',
    'app/mixins/logging',

    'app/ui/loading'

],
function ( App, Component, Logging, Loading ) {

    function Login() {
        this.defaultAttrs({
            logGroup: 'Login'
        });

        this.after('initialize', function () {
            var self = this;

            Loading.attachTo( this.$node.find('.loading') );

            this.$error = this.$node.find('p.error');

            this.on('submit', function ( e ) {
                var name = this.$node.find('input[name="name"]').val();

                e.preventDefault();

                this.$error.text('');

                if (name.length) {
                    this.log( 'Logging in with "' + name + '".' );

                    this.trigger( document, 'loading:start' );

                    App.login( name ).then(function ( data ) {
                        self.$node.hide();
                        
                        self.trigger( document, 'login:success', {
                            canvasData : data
                        });

                    }, function ( err ) {
                        self.$error.text( err );
                    }).always(function () {
                        self.trigger( document, 'loading:done' );
                    });
                } else {
                    this.$error.text( 'Please enter a name' );
                }
            });
        });
    }

    return Component(Login, Logging);

});