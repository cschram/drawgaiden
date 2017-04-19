define([

    'app/app',
    'flight/component',
    'app/mixins/logging'

],
function ( App, Component, Logging ) {

    function UserCanvas() {
        this.defaultAttrs({
            logGroup : 'UserCanvas'
        });

        this.after('initialize', function () {
            var self  = this,
                users = {};

            this.ctx      = this.node.getContext( '2d' );
            this.ctx.font = 'bold 11px Helvetica';

            function update() {
                self.ctx.clearRect( 0, 0, self.node.width, self.node.height );

                var name, user, size;

                for ( name in users ) {
                    if ( users.hasOwnProperty( name ) ) {
                        user = users[ name ];
                        if ( user.active ) {
                            size = self.ctx.measureText( name );

                            self.ctx.fillStyle = '#ffffff';
                            self.ctx.fillRect(
                                user.x - 2,
                                user.y - 11,
                                size.width + 4,
                                15
                            );

                            self.ctx.fillStyle = '#000000';
                            self.ctx.fillText( name, user.x, user.y );
                        }
                    }
                }
            }

            this.on('user:update', function ( e, data ) {
                users[ data.name ] = data;
                update();
            });

            this.on( document, 'canvas:users:reposition', function ( e, data ) {
                this.$node.css( 'left', '-' + data.x + 'px' );
                this.$node.css( 'top', '-' + data.y + 'px' );
            });

        });
    }

    return Component(UserCanvas, Logging);

});