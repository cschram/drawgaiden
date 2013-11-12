//
// Draw Gaiden Service Manager
//

var path    = require( 'path' ),
    dnode   = require( '../node_modules/dnode' ),
    winston = require( '../node_modules/winston' );

var db = require( '../lib/db' );

var config = require( '../config' ),
    logger = new winston.Logger({
        transports : [
            new winston.transports.Console({
                json      : false,
                timestamp : true
            }),
            new winston.transports.File({
                json      : false,
                timestamp : true,
                filename  : path.join( config.logDirectory, 'services.debug.log' )
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
                filename  : path.join( config.logDirectory, 'services.exceptions.log' )
            })
        ]
    });

var services = [
        require( './flatten/client' )
    ],
    canvases = {};

db.connect( config.db.rethinkdb ).then(function () {

    logger.info( '-------------- Starting Service Manager --------------' );

    var server = dnode({

        initServices : function ( canvas, done ) {
            if ( !canvases.hasOwnProperty( canvas ) ) {
                logger.info( 'Starting services for ' + canvas );
                canvases[ canvas ] = {};
                canvases[ canvas ].services = services.map(function ( service ) {
                    return service.init( canvas, logger );
                });
            }
            done();
        },

        stopServices : function ( canvas, done ) {
            if ( canvas.hasOwnProperty( canvas ) ) {
                logger.info( 'Stopping services for ' + canvas );
                canvases[ canvas ].services.forEach(function ( service ) {
                    service.stop();
                });
                delete canvases[ canvas ];
            }
            done();
        }

    });

    var host = config.services.manager.host,
        port = config.services.manager.port;
    server.listen( host, port );
    logger.info( 'Started server at ' + host + ':' + port + '.' );

}, function ( err ) {
    throw err;
});