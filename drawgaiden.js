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
    redis      = require( 'socket.io/node_modules/redis' );

//
// Internal Dependencies
//

var config  = require( './config' ),
    state   = require( './lib/state' ),
    db      = require( './lib/db' );

// Modules to load
var modules = [
    'login',
    'canvas'
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
});

io.configure('production', function () {
    io.enable( 'browser client etag' );
    io.set( 'log level', 1 );
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

db.connect( config.db.thinkdb ).then(function () {
        state.users = [];

    modules = modules.map(function ( moduleName ) {
        var module = require( './lib/modules/' + moduleName );
        module.init();
        return module;
    });

    server.listen(app.get( 'port' ), function () {
        console.log( 'Express server listening on port ' + app.get( 'port' ) );
    });

    io.sockets.on( 'connection', function ( socket ) {
        modules.forEach(function ( module ) {
            module.connect( socket );
        });
    });

}, function ( err ) {
    throw err;
});