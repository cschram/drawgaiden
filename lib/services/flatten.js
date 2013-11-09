var dnode = require( 'dnode' );

var db     = require( '../db' ),
	config = require( '../../config' );

var timer;

module.exports = {

	init : function ( canvas, logger ) {
		logger = logger || console;

		logger.info( 'Starting Flatten service connection' );

		var conf = config.services.flatten;

		// Connect to remote Flatten service
		var d = dnode.connect( conf.host, conf.port );

		d.on( 'remote', function ( service ) {
			logger.info( 'Flatten service loaded' );

			// Perform operation
			function flatten() {
				var t = Date.now();

				db.getHistory( canvas ).then(function ( history ) {

					// Only flatten if there's actually something to flatten
					if ( history.length > ( config.historyDepth + 1 ) ) {
						history = history.slice( 0, history.length - config.historyDepth );

						service.flatten( history, function ( response ) {

							// Delete flattened entries and push new flat image entry
							db.deleteNHistoryEntries( canvas, history.length ).done(function () {
								var newEntry = {
									canvas : canvas,
									tool   : 'image',
									user   : '',
									path   : [ response.data ],
									settings : {
										width  : response.width,
										height : response.height
									},
									timestamp : 1
								};

								db.pushHistory( canvas, newEntry ).done(function () {
									timer = setTimeout( flatten, conf.interval );
								});
							});
						});
					} else {
						timer = setTimeout( flatten, conf.interval );
					}

				}, function ( err ) {
					logger.error( '[Flatten Service] Error: ' + err );
				});
			}

			flatten();

		});

		d.on( 'error', function ( err ) {
			logger.error( '[Flatten Service] Error: ' + err );
			clearTimeout( timer );
		});

		d.on( 'end', function () {
			logger.info( '[Flatten Service] Connection closed.' );
			clearTimeout( timer );
		});
	}

};