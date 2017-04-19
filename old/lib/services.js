var dnode = require( 'dnode' );

var config = require( '../config' );

module.exports = {

    connections : {},
    remotes     : {},

    init : function ( canvas, logger ) {
        logger.info( 'Initializing services for ' + canvas );

        var self = this,
            conn = dnode.connect(
            config.services.manager.host,
            config.services.manager.port
        );

        conn.on( 'remote', function ( remote ) {
            logger.info( 'Connected to remote' );
            remote.initServices( canvas, function () {
                logger.info( 'Services loaded for ' + canvas );
            });

            self.remotes[ canvas ] = remote;
        });

        this.connections[ canvas ] = conn;
    },

    stop : function ( canvas ) {
        var self = this;
        this.remotes[ canvas ].stopServices( canvas, function () {
            self.connections[ canvas ].end();
        });
    }
}