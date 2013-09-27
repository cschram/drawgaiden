var express = require( 'express' ),
    app     = express(),
    server  = require( 'http' ).createServer( app ),
    io      = require( 'socket.io' ).listen( server ),
    path    = require( 'path' ),
    config  = require( './config' ),
    state   = require( './lib/state' );

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

server.listen( app.get( 'port' ), function () {
    console.log( 'Express server listening on port ' + app.get( 'port' ) );
});

io.sockets.on( 'connection', function ( socket ) {

    socket.on( 'disconnect', function () {
        socket.get( 'name', function ( e, name ) {
            if ( e ) {
                console.error( 'Error getting name: ' + e );
                return;
            }

            if ( state.users.hasOwnProperty( name ) ) {
                delete state.users[ name ];
                socket.emit( 'users:update', state.users );
            }
        });
    });

    socket.on( 'login', function ( name, done ) {

        if ( state.users.hasOwnProperty( name ) ) {

            done( 'A user with that name is already logged in.' );

        } else {

            socket.set( 'name', name, function () {
                state.users[ name ] = {
                    active : false,
                    x      : 0,
                    y      : 0
                };
                done( null, state.operations );
            });

        }

    });

    socket.on( 'draw', function ( data ) {
        socket.get('name', function ( e, name ) {
            if ( e ) {
                console.error( 'Error getting name: ' + e );
                return;
            }

            data.user = name;
            state.operations.push( data );
            socket.broadcast.emit( 'draw', data );
        });
    });

    socket.on( 'clear', function () {
        state.operations = [];
        socket.broadcast.emit( 'clear' );
    });

    socket.on('user:update', function ( data ) {
        socket.get('name', function ( e, name ) {
            if ( e ) {
                console.error( 'Error getting name: ' + e );
                return;
            }

            if ( state.users.hasOwnProperty( name ) ) {
                state.users[ name ] = data;

                // Make a copy of state.users that doesn't include the current user
                var d = [];
                for (var n in state.users) {
                    if ( state.users.hasOwnProperty( n ) ) {
                        d.push({
                            name : name,
                            x    : state.users[ n ].x,
                            y    : state.users[ n ].y
                        });
                    }
                }
                socket.broadcast.emit( 'users:update', d );
            }
        });
    });
        
});