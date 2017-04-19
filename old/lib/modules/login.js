var Q = require( 'q' ),
    r = require( 'rethinkdb' );

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

            db.userInCanvas( name, 'default' ).then(function ( result ) {
                if ( result ) {
                    done( 'A user with that name is already logged in.' );
                    return;
                }
                
                Q.all([
                    Q.nfcall( sock.set.bind( sock ), 'name', name ),
                    db.addUser( name, 'default' ),
                    db.getHistory( 'default' )
                ]).then(function ( result ) {
                    done( null, result[2] );
                }, function ( err ) {
                    self.logger.error( err );
                    done( 'Unknown error occurred, please try again later.' );
                });
            });

        });

        sock.on( 'disconnect', function () {
            sock.get( 'name', function ( e, name ) {
                if ( e ) {
                    self.logger.error( 'Error getting name: ' + e );
                    return;
                }

                db.removeUser( name, 'default' ).fail(function ( err ) {
                    self.logger.error( 'Error removing user from canvas: ' + err );
                });

                sock.broadcast.emit( 'user:update', {
                    name   : name,
                    active : false
                });
            });
        });
    }

};