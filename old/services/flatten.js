var Canvas  = require( '../node_modules/canvas' ),
    winston = require( '../node_modules/winston' );

var db     = require( '../lib/db' ),
    config = require( '../config' );

//
// Tool Libraries
//

var CircleTool    = require( '../public/js/app/tools/circle' ),
    EraserTool    = require( '../public/js/app/tools/eraser' ),
    PencilTool    = require( '../public/js/app/tools/pencil' ),
    RectangleTool = require( '../public/js/app/tools/rectangle' ),
    ImageTool     = require( '../public/js/app/tools/image' );

//
// Setup
//

var width  = config.canvasSize.width,
    height = config.canvasSize.height,
    canvas = new Canvas( width, height ),
    ctx    = canvas.getContext( '2d' ),
    tools  = {
        'pencil'    : new PencilTool( ctx ),
        'rectangle' : new RectangleTool( ctx ),
        'circle'    : new CircleTool( ctx ),
        'eraser'    : new EraserTool( ctx ),
        'image'     : new ImageTool( ctx )
    };

module.exports = {

    init : function ( canvasName, logger ) {
        var conf     = config.services.flatten,
            interval = conf.interval * 1000,
            timer;

        logger = logger || console;

        // Perform operation
        function flatten() {
            var t = Date.now();

            db.getHistory( canvasName ).then(function ( history ) {

                // Only flatten if there's actually something to flatten
                if ( history.length > ( config.historyDepth + 1 ) ) {
                    history = history.slice( 0, history.length - config.historyDepth );

                    ctx.clearRect( 0, 0, width, height );

                    history.forEach(function ( entry ) {
                        tools[ entry.tool ].draw( entry.path, entry.settings );
                    });

                    // Delete flattened entries and push new flat image entry
                    db.deleteNHistoryEntries( canvasName, history.length ).done(function () {
                        var newEntry = {
                            canvas : canvasName,
                            tool   : 'image',
                            user   : '',
                            path   : [ canvas.toDataURL( 'image/png' ) ],
                            settings : {
                                width  : width,
                                height : height
                            },
                            timestamp : 1
                        };

                        db.pushHistory( canvasName, newEntry ).done(function () {
                            logger.info(
                                'Flattened ' + canvasName + ' history in ' + ( Date.now() - t ) + 'ms'
                            );
                            timer = setTimeout( flatten, interval );
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

        return {
            stop : function () {
                clearTimeout( timer );
            }
        };
    }

};