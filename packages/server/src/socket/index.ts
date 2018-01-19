import * as SocketIO from 'socket.io';
import * as redis from 'socket.io-redis';
import * as Hapi from 'hapi';
import { createLogger } from '../lib/logger';
import { Connection } from '../lib/db';
import session from './session';
import config from '../lib/config';

const logger = createLogger('socket');
// const monitor = new HealthMonitor({
//     port
// });

// connect(config.db).then((dbConn: Connection) => {
//     const io = SocketIO(monitor.getServer().listener);
//     io.adapter(redis({
//         host: config.redis.host,
//         port: config.redis.port
//     }));
//     io.on('connection', (sock: SocketIO.Socket) => session({
//         sock,
//         dbConn,
//         logger
//     }));
//     logger.info(`Started socket server at ${config.socket.host}:${port}`);
// }).catch((error: any) => {
//     if (error.stack) {
//         logger.error(error.stack);
//     } else {
//         logger.error(error);
//     }
//     monitor.error(error.toString());
// });

export function attachSocketServer(httpServer: Hapi.Server, dbConn: Connection) {
    const io = SocketIO(httpServer.listener);
    io.adapter(redis({
        host: config.redis.host,
        port: config.redis.port
    }));
    io.on('connection', (sock: SocketIO.Socket) => session({
        sock,
        dbConn,
        logger
    }));
}