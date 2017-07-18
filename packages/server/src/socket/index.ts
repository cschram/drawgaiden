import * as SocketIO from 'socket.io';
import Logger from '../lib/logger';
import { Connection, connect } from '../lib/db';
import session from './session';
import config from '../lib/config';

const logger = Logger('socket');

connect(config.db).then(conn => {
    let port = config.socket.port;
    if (process.env.NODE_APP_INSTANCE) {
        port += parseInt(process.env.NODE_APP_INSTANCE, 10);
    }
    const io = SocketIO(port);
    io.on('connection', sock => session({
        sock,
        db: conn,
        logger
    }));
    logger.info(`Started socket server at ${config.socket.host}:${port}`);
}).catch(error => {
    if (error.stack) {
        logger.error(error.stack);
    } else {
        logger.error(error);
    }
    process.exit();
});