var path    = require( 'path' ),
	dnode   = require( 'dnode' ),
	Canvas  = require( 'canvas' ),
	winston = require( 'winston' );

var config = require( '../../config' );

var logger = new winston.Logger({
        transports : [
            new winston.transports.Console({
                json      : false,
                timestamp : true
            }),
            new winston.transports.File({
                json      : false,
                timestamp : true,
                filename  : path.join( config.logDirectory, 'flatten/debug.log' )
            })
        ],
        exceptionHandlers : [
            new winston.transports.Console({
                json      : false,
                timestamp : true
            }),
            new winston.transports.File({
                json      : false,
                timestamp : true,
                filename  : path.join( config.logDirectory, 'flatten/exceptions.log' )
            })
        ]
    });

//
// Tool Libraries
//

var CircleTool    = require( '../../public/js/app/tools/circle' ),
	EraserTool    = require( '../../public/js/app/tools/eraser' ),
	PencilTool    = require( '../../public/js/app/tools/pencil' ),
	RectangleTool = require( '../../public/js/app/tools/rectangle' );

//
// Setup
//

var canvas = new Canvas( config.canvasSize.width, config.canvasSize.height ),
	ctx    = canvas.getContext( '2d' ),
	tools  = {
        'pencil'    : new PencilTool( ctx ),
        'rectangle' : new RectangleTool( ctx ),
        'circle'    : new CircleTool( ctx ),
        'eraser'    : new EraserTool( ctx )
    };

//
// Create RPC Server
//

logger.info( '-------------- Starting Flatten Service --------------' );

var server = dnode({
	flatten : function ( history, done ) {
		var t = Date.now();

		ctx.clearRect( 0, 0, config.canvasSize.width, config.canvasSize.height );

		history.forEach(function ( entry ) {
			tools[ entry.tool ].draw( entry.path, entry.settings );
		});

		logger.info( 'Flattened ' + history.length + ' entries in ' + (Date.now() - t) + 'ms.' );

		done( canvas.toDataURL( 'image/png' ) );
	}
});

server.listen( config.services.flatten.port );
logger.info( 'Started on port ' + config.services.flatten.port );