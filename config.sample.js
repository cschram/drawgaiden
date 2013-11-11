module.exports = {

    // Port to run Draw Gaiden on
    port : 9000,

    // Base log directory
    logDirectory : '/var/log/drawgaiden',

    // Maximum history depth
    // This is the maximum number of history entries kept after
    // the history is flattened.
    historyDepth : 100,

    db : {
        // RethinkDB Instance
        rethinkdb: {
            host : 'localhost',
            port : 28015,
            db   : 'drawgaiden'
        },
        // Redis Instance
        redis: {
            host : 'localhost',
            port : 6379
        }
    },

    // Service configuration
    services : {
        // Management service, manages other services
        manage : {
            host : 'localhost',
            port : 9000
        },
        
        // Service for flattening the canvas history
        flatten : {
            host     : 'localhost',
            port     : 9001,
            // Interval, in seconds, to run flatten service
            interval : 60
        }
    },

    // Canvas Size
    canvasSize : {
        width  : 2000,
        height : 2000
    },

    // Enabled Tools
    tools : {
        pencil      : true,
        rectangle   : true,
        circle      : true,
        eraser      : true,
        colorpicker : true
    }

};