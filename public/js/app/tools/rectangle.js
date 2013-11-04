if (typeof define !== 'function') {
    var define = require('amdefine')(module);
}

define([

    'jquery',
    'app/tools/tool',
    'simplify'

],
function ( $, Tool, simplify ) {

    var RectangleTool = Tool.extend({

        defaults: $.extend({}, Tool.prototype.defaults, {
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

});