(function () {

    function init( Tool, Img ) {
        Img = Img || Image;

        var ImageTool = Tool.extend({

            draw : function ( path, settings ) {
                var i = new Img();
                i.src = path[0];
                this.finalCtx.drawImage(i, 0, 0);
            }

        });

        return ImageTool;
    }

    if ( typeof define === "function" && define.amd ) {
        define( [ './tool' ] , init );
    } else {
        var Tool = require( './tool' ),
            Img  = require( '../../../../node_modules/canvas' ).Image;
        module.exports = init( Tool, Img );
    }

}());