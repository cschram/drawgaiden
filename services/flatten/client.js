var dnode = require( '../../node_modules/dnode' );

var db     = require( '../../lib/db' ),
    config = require( '../../config' );

module.exports = {

    init : function ( canvas, logger ) {
        var conf     = config.services.flatten,
            interval = conf.interval * 1000,
            conn     = dnode.connect( conf.host, conf.port ),
            timer;

        logger = logger || console;

        conn.on( 'remote', function ( service ) {
            logger.info( 'Flatten service loaded for ' + canvas );

            // Perform operation
            function flatten() {
                db.getHistory( canvas ).then(function ( history ) {

                    // Only flatten if there's actually something to flatten
                    if ( history.length > ( config.historyDepth + 1 ) ) {
                        history = history.slice( 0, history.length - config.historyDepth );

                        service.flatten( history, function ( response ) {

                            // Delete flattened entries and push new flat image entry
                            db.deleteNHistoryEntries( canvas, history.length ).done(function () {
                                var newEntry = {
                                    canvas : canvas,
                                    tool   : 'image',
                                    user   : '',
                                    path   : [ response.data ],
                                    settings : {
                                        width  : response.width,
                                        height : response.height
                                    },
                                    timestamp : 1
                                };

                                db.pushHistory( canvas, newEntry ).done(function () {
                                    timer = setTimeout( flatten, interval );
                                });
                            });
                        });
                    } else {
                        timer = setTimeout( flatten, interval );
                    }

                }, function ( err ) {
                    logger.error( '[Flatten Service] Error: ' + err );
                });
            }

            flatten();

        });

        conn.on( 'error', function ( err ) {
            logger.error( '[Flatten Service] Error: ' + err );
            clearTimeout( timer );
        });

        conn.on( 'end', function () {
            logger.info( '[Flatten Service] Connection closed.' );
            clearTimeout( timer );
        });

        return {
            stop : function () {
                conn.end();
                clearTimeout( timer );
            }
        };
    }

};