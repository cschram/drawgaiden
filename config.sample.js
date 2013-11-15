module.exports = {

    // Port to run Draw Gaiden on
    port : 3000,

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
        manager : {
            host : 'localhost',
            port : 9000
        },

        // Flatten service
        flatten : {
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