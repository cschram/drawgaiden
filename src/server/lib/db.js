'use strict';

const r = require('rethinkdb');

class DBConnection {
    this(connection) {
        this.conn = connection;
    }

    getCanvas(id) {
        return r.table('canvas').get(id).run(this.conn);
    }
}

function connect(options) {
    return r.connect(options).then(conn => {
        return new DBConnection(conn);
    });
}

module.exports = {
    DBConnection,
    connect
};