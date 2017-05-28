import * as SocketIO from 'socket.io';
import Logger from './logger';
import { Connection, connect } from './db';
import ConnectionManager from './connection-manager';

const config = require('../../config/server.json');
const logger = Logger('socket');

connect(config.db).then(conn => {
    const io = SocketIO(config.socket.port);
    io.on('connection', sock => {
        const connMgr = new ConnectionManager(sock, conn, logger);
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