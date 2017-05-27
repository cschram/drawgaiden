'use strict';

const config = require('../../config/server.json');

class ConnectionManager {
    constructor(sock, db, logger) {
        this.sock = sock;
        this.db = db;
        this.logger = logger;
    }
}

module.exports = ConnectionManager;