var express = require( 'express' ),
    app     = express(),
    server  = require( 'http' ).createServer( app ),
    io      = require( 'socket.io' ).listen( server ),
    path    = require( 'path' ),
    r       = require( 'rethinkdb' );

var config  = require( './config' ),
    state   = require( './lib/state' ),
    db      = require( './lib/db' );

var modules = [
    'login',
    'canvas'
];

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

app.get( '/', function ( req, res ) {
    res.render( 'index', config );
});

db.connect(config.dbconfig).then(function () {

    db.get('default').then(function ( canvas ) {

        state.canvas       = canvas;
        state.canvas.users = [];

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

}, function ( err ) {
    throw err;
});