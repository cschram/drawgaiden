var r = require( 'rethinkdb' );

var db = require( '../db' );

module.exports = {

    logger : console,
    sock   : null,

    init : function ( logger ) {
        this.logger = logger;
        this.logger.info( 'Canvas Module Loaded' );
    },

    connect : function ( sock ) {
        var self = this;
        
        this.sock = sock;

        sock.on( 'draw', function ( data ) {
            sock.get('name', function ( e, name ) {
                if ( e ) {
                    self.logger.error( 'Error getting name: ' + e );
                    return;
                }

                data.user = name;
                sock.broadcast.emit( 'draw', data );

                db.pushHistory( 'default', data ).fail(function ( err ) {
                    self.logger( 'Error saving canvas history: ' + err );
                });
            });
        });

        sock.on( 'clear', function ( done ) {
            sock.get('name', function ( e, name ) {
                if ( e ) {
                    self.logger.error( 'Error getting name: ' + e );
                    return;
                }

                db.getHistory( 'default' ).then(function ( history ) {

                    // Make a new history list without the users history in it
                    var hist = [],
                        i    = 0,
                        len  = history.length;

                    for (; i < len; i++) {
                        if ( history[i].user !== name ) {
                            hist.push( history[i] );
                        }
                    }

                    // Clear in the database
                    db.clearUserHistory( 'default', name ).fail(function ( err ) {
                        self.logger( 'Error clearing user history: ' + err );
                    });

                    // Instruct users to redraw with new history
                    sock.broadcast.emit( 'redraw', hist );
                    done( null, hist );

                }, function ( err ) {
                    self.logger( 'Error getting canvas history: ' + err );
                    done( 'Unknown error occurred, please try again later.' );
                });
            });
        });

        sock.on( 'clear-all', function () {
            db.clearHistory( 'default' ).fail(function ( err ) {
                self.logger( 'Error clearing canvas history: ' + err );
            });
            sock.broadcast.emit( 'clear' );
        });

        sock.on('user:update', function ( data ) {
            sock.get('name', function ( e, name ) {
                if ( e ) {
                    self.logger.error( 'Error getting name: ' + e );
                    return;
                }

                data.name = name;
                sock.broadcast.emit( 'user:update', data );
            });
        });
    }

};