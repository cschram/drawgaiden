//
// Third Party / Built In Dependencies
//

var express    = require( 'express' ),
    app        = express(),
    server     = require( 'http' ).createServer( app ),
    io         = require( 'socket.io' ).listen( server ),
    path       = require( 'path' ),
    r          = require( 'rethinkdb' ),
    RedisStore = require( 'socket.io/lib/stores/redis' ),
    redis      = require( 'socket.io/node_modules/redis' ),
    winston    = require( 'winston' );

//
// Internal Dependencies
//

var config  = require( './config' ),
    db      = require( './lib/db' );

config.version = '0.2 (Beta)';

// Loggers
var logger = new winston.Logger({
        transports : [
            new winston.transports.Console({
                json      : false,
                timestamp : true
            }),
            new winston.transports.File({
                json      : false,
                timestamp : true,
                filename  : path.join( config.logDirectory, 'drawgaiden/debug.log' )
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
                filename  : path.join( config.logDirectory, 'drawgaiden/exceptions.log' )
            })
        ]
    }),
    socketLog = new winston.Logger({
        transports : [
            new winston.transports.File({
                json      : false,
                timestamp : true,
                filename  : path.join( config.logDirectory, 'drawgaiden/activity.log' )
            })
        ]
    });

// Modules to load
var modules = [
    'login',
    'canvas'
];

// Services
var services = [
    'flatten'
];

//
// Express Config
//

app.configure(function () {
    app.set( 'port', process.env.PORT || 3000 );
    app.set( 'views', __dirname + '/views' );
    app.set( 'view engine', 'hjs' );
    app.use( express.favicon() );
    app.use( express.logger( 'dev' ) );
    app.use( express.bodyParser() );
    app.use( express.methodOverride() );
    app.use( app.router );
    app.use( express.static( path.join( __dirname, 'public' ) ) );
});

app.configure( 'development', function () {
    app.use( express.errorHandler() );
});

//
// Socket.IO Config
//

io.configure(function () {
    io.set('store', new RedisStore({
        redisPub    : redis.createClient( config.db.redis.port, config.db.redis.host ),
        redisSub    : redis.createClient( config.db.redis.port, config.db.redis.host ),
        redisClient : redis.createClient( config.db.redis.port, config.db.redis.host )
    }));
    io.set( 'logger', socketLog );
    io.set( 'log level', 2 );
});

io.configure('production', function () {
    io.enable( 'browser client etag' );
    io.set( 'log level', 0 );
});

io.configure('development', function () {
    io.set( 'transports', [ 'websocket' ] );
});

//
// Routes
//

app.get( '/', function ( req, res ) {
    res.render( 'index', config );
});

//
// Init
//

db.connect( config.db.rethinkdb ).then(function () {

    logger.info( '-------------- Starting Draw Gaiden --------------' );

    logger.info( 'Loading Modules' );
    modules = modules.map(function ( moduleName ) {
        var module = require( './lib/modules/' + moduleName );
        module.init( logger );
        return module;
    });

    logger.info( 'Loading Services' );
    services = services.map(function ( serviceName ) {
        console.log('./lib/services/' + serviceName);
        var service = require( './lib/services/' + serviceName );
        service.init( 'default', logger );
        return service;
    });

    server.listen(app.get( 'port' ), function () {
        logger.info( 'Server listening on port ' + app.get( 'port' ) );
    });

    io.sockets.on( 'connection', function ( socket ) {
        modules.forEach(function ( module ) {
            module.connect( socket );
        });
    });

}, function ( err ) {
    throw err;
});