'use strict';

const config = require('../../config/server.json');
const Session = require('./session');

class ConnectionManager {
    constructor(sock, db, logger) {
        this.sock = sock;
        this.db = db;
        this.logger = logger;
        this.session = new Session(config.secret);
    }
}

module.exports = ConnectionManager;