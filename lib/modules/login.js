var r = require( 'rethinkdb' );

var db = require( '../db' );

var users = [];

module.exports = {

    logger : console,
    sock   : null,

    init : function ( logger ) {
        this.logger = logger;
        this.logger.info( 'Login Module Loaded' );
    },

    connect : function ( sock ) {
        var self = this;
        
        this.sock = sock;

        sock.on( 'login', function ( name, done ) {

            if ( users.indexOf ( name ) > -1 ) {

                done( 'A user with that name is already logged in.' );

            } else {

                sock.set( 'name', name, function () {
                    users.push( name );
                    
                    db.getHistory( 'default' ).then(function ( history ) {
                        done( null, history );
                    }, function ( err ) {
                        self.logger( 'Error getting canvas history: ' + err );
                        done( 'Unknown error occurred, please try again later.' );
                    });
                });

            }

        });

        sock.on( 'disconnect', function () {
            sock.get( 'name', function ( e, name ) {
                if ( e ) {
                    self.logger.error( 'Error getting name: ' + e );
                    return;
                }

                var i = users.indexOf( name );
                if ( i > -1 ) {
                    users.splice( i, 1 );
                    sock.broadcast.emit( 'user:update', {
                        name   : name,
                        active : false
                    });
                }
            });
        });
    }

};