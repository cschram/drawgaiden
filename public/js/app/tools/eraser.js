define([

    'app/tools/tool',
    'simplify'

],
function ( Tool, simplify ) {

    var EraserTool = Tool.extend({

        _resetCtx: function ( ctx, settings, clear ) {
            settings.globalCompositeOperation = 'destination-out';
            settings.strokeStyle              = 'rgba(0, 0, 0, 1)';
            this._super( ctx, settings, clear );
        },

        draw: function ( path, settings ) {
            if (path.length === 0) {
                return;
            }

            settings = settings || this.settings;

            this.finalCtx.beginPath();
            this._resetCtx( this.finalCtx, settings );

            if (path.length === 1) {
                this.finalCtx.fillStyle = settings.strokeStyle;
                this.finalCtx.arc(
                    path[0].x,
                    path[0].y,
                    settings.lineWidth / 2,
                    0,
                    2 * Math.PI,
                    false
                );
                this.finalCtx.fill();
            } else {
                path = simplify( path, 0.8, true );

                for (var i = 1, len = path.length; i < len; i++) {
                    this.finalCtx.moveTo( path[i - 1].x, path[i - 1].y );
                    this.finalCtx.lineTo( path[i].x,     path[i].y );
                }

                this.finalCtx.stroke();
            }

            this.finalCtx.closePath();
        }

    });

    return EraserTool;

});