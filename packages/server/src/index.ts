import * as Hapi from 'hapi';
import { createLogger } from './lib/logger';
import { Connection, connect } from './lib/db';
import config from './lib/config';
import { HealthMonitor } from './lib/healthmonit';
import { attachSocketServer } from './socket';

let port = config.server.port;
if (process.env.NODE_APP_INSTANCE) {
    port += parseInt(process.env.NODE_APP_INSTANCE, 10);
}

const logger = createLogger('http');
const server = new Hapi.Server();
server.connection({
    host: config.server.host,
    port
});
const monitor = new HealthMonitor(server);

connect(config.db).then((dbConn: Connection) => {
    // Import and run REST API modules
    const modules = require('require-dir')('./rest');
    Object.keys(modules).forEach(moduleName => {
        const module = modules[moduleName];
        module.setup(server, dbConn, logger);
    });

    // Attach socket server
    attachSocketServer(server, dbConn);

    // Start the server
    return server.start();
}).catch((error: any) => {
    if (error.stack) {
        logger.error(error.stack);
    } else {
        logger.error(error);
    }
    monitor.error(error.toString());
});