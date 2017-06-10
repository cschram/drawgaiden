import * as SocketIO from 'socket.io';
import Logger from '../lib/logger';
import { Connection, connect } from '../lib/db';
import Session from './session';
import config from '../lib/config';

const logger = Logger('socket');

connect(config.db).then(conn => {
    const io = SocketIO(config.socket.port);
    io.on('connection', sock => {
        // There isn't a good reason for this to be a class/object, should be refactored
        // to be a function.
        const session = new Session(sock, conn, logger);
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