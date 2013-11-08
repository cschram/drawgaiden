module.exports = {

    // Port to run Draw Gaiden on
    port : 9000,

    // Base log directory
    logDirectory : '/var/log/drawgaiden',

    // Maximum history depth
    // This is the maximum number of history entries kept after
    // the history is flattened.
    historyDepth : 50,

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
        // Service for flattening the canvas history
        flatten : {
            host     : 'localhost',
            port     : 9001,
            interval : 60 * 1000
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