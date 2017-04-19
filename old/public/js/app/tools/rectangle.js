(function () {

    function init( _, Tool, simplify ) {

        var RectangleTool = Tool.extend({

            defaults: _.extend({}, Tool.prototype.defaults, {
                strokeStyle : '#000000',
                fillStyle   : '#ffffff',
                lineWidth   : 1,
                lineCap     : 'butt',
                lineJoin    : 'miter'
            }),

            _draw: function ( path, ctx ) {
                var start = {
                        x: (path[0].x > path[1].x) ? path[1].x : path[0].x,
                        y: (path[0].x > path[1].y) ? path[1].y : path[0].y
                    },
                    end = {
                        x: (path[0].x < path[1].x) ? path[1].x : path[0].x,
                        y: (path[0].x < path[1].y) ? path[1].y : path[0].y
                    };

                ctx.beginPath();
                ctx.rect(start.x, start.y, end.x - start.x, end.y - start.y);
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
            },

            mouseDown: function ( coord ) {
                this.active = true;
                this.path   = [ coord, coord ];
            },

            mouseMove: function ( coord ) {
                if ( this.active ) {
                    this.path[1] = coord;

                    this._resetCtx( this.draftCtx, this.settings, true );
                    this._draw( this.path, this.draftCtx );
                }
            },

            draw: function ( path, settings ) {
                settings = settings || this.settings;

                this._resetCtx( this.finalCtx, settings );
                this._draw( path, this.finalCtx );
            }

        });

        return RectangleTool;

    }

    if ( typeof define === "function" && define.amd ) {
        define( [ 'lodash', './tool', '../../contrib/simplify-js/simplify' ] , init );
    } else {
        var _        = require( '../../contrib/lodash/lodash' ),
            Tool     = require( './tool' ),
            simplify = require( '../../contrib/simplify-js/simplify' );
        module.exports = init( _, Tool, simplify );
    }

}());