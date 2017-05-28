import * as SocketIO from 'socket.io';
import * as winston from 'winston';
import { Connection } from './db';

const config = require('../../config/socket-server.json');

export default class ConnectionManager {
    private sock: SocketIO.Socket;
    private db: Connection;
    private logger: winston.LoggerInstance;

    constructor(sock: SocketIO.Socket, db: Connection, logger: winston.LoggerInstance) {
        this.sock = sock;
        this.db = db;
        this.logger = logger;
    }
}