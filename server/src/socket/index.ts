import * as SocketIO from 'socket.io';
import Logger from '../lib/logger';
import { Connection, connect } from '../lib/db';
import session from './session';
import config from '../lib/config';

const logger = Logger('socket');

connect(config.db).then(conn => {
    const io = SocketIO(config.socket.port);
    io.on('connection', sock => session(sock, conn, logger));
    logger.info(`Started socket server at ${config.socket.host}:${config.socket.port}`);
}).catch(error => {
    if (error.stack) {
        logger.error(error.stack);
    } else {
        logger.error(error);
    }
    process.exit();
});