'use strict';

const SocketServer = require('socket.io');
const logger = require('./logger')('socket');
const db = require('./db');
const ConnectionManager = require('./connection-manager');
const config = require('../../config/server.json');

db.connect(config.db).then(conn => {
    const io = SocketServer(config.socket.port);
    io.on('connection', sock => {
        const connMgr = new ConnectionManager(sock, db, logger);
    });
    logger.info(`Started socket server at ${config.socket.host}:${config.socket.port}`);
}).catch(error => {
    if (error.stack) {
        logger.error(error.stack);
    } else {
        logger.error(error);
    }
    process.exit();
});