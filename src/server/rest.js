'use strict';

const path = require('path');
const hapi = require('hapi');
const logger = require('./lib/logger')('rest');
const db = require('./lib/db');
const config = require('../../config/server.json');

function reportError(error) {
    if (error.stack) {
        logger.error(error.stack);
    } else {
        logger.error(error);
    }
}

const server = new hapi.Server();

db.connect(config.db).then(conn => {
    server.connection({
        host: config.rest.host,
        port: config.rest.port
    });

    server.on('log', (event, tags) => {
        if (tags.error) {
            reportError(event);
        } else {
            logger.info(event);
        }
    });

    server.route({
        method: 'GET',
        path: '/api/canvas/{id}',
        handler(request, reply) {
            return conn.getCanvas(request.params.id);
        }
    });

    return server.start();
}).then(() => {
    logger.info(`Started REST service at ${server.info.url}`);
}).catch(error => {
    reportError(error);
    process.exit(1);
});