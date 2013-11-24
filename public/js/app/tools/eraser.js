(function () {

    var isNode = false;

    function init( Pencil ) {

        var EraserTool = Pencil.extend({

            _clone: null,
            _cloneCtx: null,

            init: function () {
                this._super.apply( this, arguments );

                // Create canvas element for cloning
                if ( !isNode ) {
                    this._clone        = document.createElement('canvas');
                    this._clone.width  = this.finalCtx.canvas.width;
                    this._clone.height = this.finalCtx.canvas.height;
                    this._cloneCtx     = this._clone.getContext( '2d' );
                }
            },

            _resetCtx: function ( ctx, settings, clear ) {
                settings.globalCompositeOperation = 'destination-out';
                settings.strokeStyle              = 'rgba(0, 0, 0, 1)';
                this._super( ctx, settings, clear );
            },

            mouseDown: function () {
                this._super.apply( this, arguments );

                if ( !isNode ) {
                    // Clone main canvas
                    this._clear( this._cloneCtx );
                    this._cloneCtx.drawImage( this.finalCtx.canvas, 0, 0 );
                    this.draftCtx.drawImage( this.finalCtx.canvas, 0, 0 );

                    // Clear main context temporarily
                    this._clear( this.finalCtx );
                }
            },

            mouseUp: function () {
                if ( !isNode && this.active ) {
                    this.finalCtx.drawImage( this._clone, 0, 0 );
                }
                return this._super.apply( this, arguments );
            }

        });

        return EraserTool;

    }

    if ( typeof define === "function" && define.amd ) {
        define( [ './pencil' ] , init );
    } else {
        var Pencil = require( './pencil' );

        isNode         = true;
        module.exports = init( Pencil );
    }

}());