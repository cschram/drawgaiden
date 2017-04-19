define([

    'jquery',
    'socket.io',
    'app/logger'

],
function ( $, io, Logger ) {
    
    var App = {

        socket   : null,
        userName : '',

        init: function () {
            var self = this;

            this.socket = io.connect('/');

            this.socket.on( 'error', function ( err ) {
                $.notify( err );
            });

            this.socket.on( 'disconnect', function () {
                $.notify( 'Oops! Lost connection to the server. :( Try refreshing.' );
            });

            this.socket.on( 'reconnect', function () {
                $.notify( 'Reconnected. Updating with the latest canvas data.', 'success' );
                self.updateHistory();
            });

            this.socket.on( 'draw', function ( data ) {
                $( document ).trigger( 'io:draw', data );
            });

            this.socket.on( 'redraw', function ( data ) {
                $( document ).trigger('canvas:redraw', {
                    canvasData: data
                });
            });

            this.socket.on( 'clear', function () {
                $( document ).trigger( 'actions:clear-all' );
            });

            this.socket.on( 'user:update', function ( data ) {
                $( '#user-canvas' ).trigger( 'user:update', data );
            });
        },

        login: function ( name ) {
            var self = this,
                def  = $.Deferred();

            this.socket.emit('login', name, function ( err, data ) {
                if (err) {
                    def.reject( err );
                } else {
                    self.userName = name;
                    
                    def.resolve( data );
                }
            });

            return def.promise();
        },

        draw: function ( opts ) {
            this.socket.emit( 'draw', opts );
        },

        clear: function () {
            this.socket.emit( 'clear', function ( err, data ) {
                if ( err ) {
                    $.notify( err );
                } else {
                    $( document ).trigger('canvas:redraw', {
                        canvasData: data
                    });
                }
            });
        },

        clearAll: function () {
            this.socket.emit( 'clear-all' );
        },

        updateUser: function ( active, coords ) {
            coords = coords || { x: 0, y: 0 };
            this.socket.emit('user:update', {
                active : active,
                x      : coords.x,
                y      : coords.y
            });
        },

        updateHistory: function () {
            this.socket.emit('canvas:history', function ( err, history ) {
                if ( err ) {
                    $.notify( err );
                    return;
                }

                $( document ).trigger('canvas:redraw', {
                    canvasData: history
                });
            });
        }

    };

    return App;

});