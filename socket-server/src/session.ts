import * as SocketIO from 'socket.io';
import * as winston from 'winston';
import * as r from 'rethinkdb';
import { Connection } from './db';
import {
    RequestCallback,
    Response,
    LoginRequest,
    JoinCanvasRequest,
    JoinCanvasResponse,
    DrawRequest,
    NewHistoryEvent
} from '../../common/protocol';
import {
    Canvas,
    HistoryEntry
} from '../../common/canvas';
import config from './config';

export default class Session {
    private sock: SocketIO.Socket;
    private db: Connection;
    private logger: winston.LoggerInstance;

    private userName: string;
    private canvasID: string;

    constructor(sock: SocketIO.Socket, db: Connection, logger: winston.LoggerInstance) {
        this.sock = sock;
        this.db = db;
        this.logger = logger;

        this.sock.on('disconnect', this.onDisconnect);
        this.sock.on('login', this.onLogin);
        this.sock.on('canvas:join', this.onJoinCanvas);
        this.sock.on('canvas:draw', this.onDraw);
    }

    onDisconnect = () => {
        if (this.userName) {
            this.logger.info(`User "${this.userName}" disconnected.`);
        } else {
            this.logger.info('Anonymous user disconnected.');
        }
    };

    onLogin = (req: LoginRequest, cb: RequestCallback) => {
        if (this.userName) {
            cb({
                success: false,
                errorMessage: 'Already authenticated'
            });
        }
        this.userName = req.userName;
        cb({ success: true });
    };

    onJoinCanvas = async (req: JoinCanvasRequest, cb: RequestCallback) => {
        if (!this.userName) {
            cb({
                success: false,
                errorMessage: 'Not authenticated'
            });
        }
        this.canvasID = req.canvasID;
        let canvas = await this.db.getCanvas(this.canvasID);
        if (!canvas) {
            cb({
                success: false,
                errorMessage: 'Canvas not found'
            });
        }
        let history = await this.db.getHistory(this.canvasID);
        cb({
            success: true,
            canvas,
            history
        });

        this.db.getHistoryFeed(this.canvasID).then(feed => {
            feed.each((err, change) => {
                this.sock.emit('canvas:history:new', { entry: change.new_val });
            });
        });
    };

    onDraw = async (req: DrawRequest, cb: RequestCallback) => {
        if (!this.userName) {
            cb({
                success: false,
                errorMessage: 'Not authenticated'
            });
        }
        try {
            await this.db.addHistory(req.entry);
            cb({ success: true });
        } catch(e) {
            cb({
                success: false,
                errorMessage: e.toString()
            });
        }
    };
}