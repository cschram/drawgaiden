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
	RectangleTool = require( '../../public/js/app/tools/rectangle' ),
    ImageTool     = require( '../../public/js/app/tools/image' );

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

//
// Create RPC Server
//

logger.info( '-------------- Starting Flatten Service --------------' );

var server = dnode({
	flatten : function ( history, done ) {
		var t = Date.now();

		ctx.clearRect( 0, 0, width, height );

		history.forEach(function ( entry ) {
			tools[ entry.tool ].draw( entry.path, entry.settings );
		});

		logger.info( 'Flattened ' + history.length + ' entries in ' + (Date.now() - t) + 'ms.' );

		done({
            width  : width,
            height : height,
            data   : canvas.toDataURL( 'image/png' )
        });
	}
});

server.listen( config.services.flatten.port );
logger.info( 'Started on port ' + config.services.flatten.port );