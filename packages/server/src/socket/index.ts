import * as SocketIO from 'socket.io';
import * as redis from 'redis';
import * as ioRedis from 'socket.io-redis';
import Logger from '../lib/logger';
import { Connection, connect } from '../lib/db';
import session from './session';
import config from '../lib/config';
import { HealthMonitor } from '../lib/healthmonit';

let port = config.socket.port;
if (process.env.NODE_APP_INSTANCE) {
    port += parseInt(process.env.NODE_APP_INSTANCE, 10);
}

const logger = Logger('socket');
const monitor = new HealthMonitor({
    port
});

connect(config.db).then(dbConn => {
    const redisConn = redis.createClient({
        host: config.redis.host,
        port: config.redis.port
    });
    const io = SocketIO(monitor.getServer().listener);
    io.adapter(ioRedis({
        pubClient: redisConn,
        subClient: redisConn
    }));
    io.on('connection', sock => session({
        sock,
        dbConn,
        redisConn,
        logger
    }));
    logger.info(`Started socket server at ${config.socket.host}:${port}`);
}).catch(error => {
    if (error.stack) {
        logger.error(error.stack);
    } else {
        logger.error(error);
    }
    monitor.error(error.toString());
});