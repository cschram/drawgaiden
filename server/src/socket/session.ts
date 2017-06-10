import * as SocketIO from 'socket.io';
import * as winston from 'winston';
import * as r from 'rethinkdb';
import { Connection } from '../lib/db';
import {
    RequestCallback,
    Response,
    LoginRequest,
    JoinCanvasRequest,
    JoinCanvasResponse,
    DrawRequest,
    NewHistoryEvent
} from '../../../defs/protocol';
import {
    Canvas,
    HistoryEntry
} from '../../../defs/canvas';
import config from '../lib/config';

const MAX_USERNAME_LENGTH = 10;

export default class Session {
    private sock: SocketIO.Socket;
    private db: Connection;
    private logger: winston.LoggerInstance;

    private username: string;
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
        if (this.username) {
            this.logger.info(`User "${this.username}" disconnected.`);
        } else {
            this.logger.info('Anonymous user disconnected.');
        }
    };

    onLogin = (req: LoginRequest, cb: RequestCallback) => {
        if (this.username) {
            cb({
                success: false,
                errorMessage: 'Already authenticated'
            });
        }
        if (req.username.length > MAX_USERNAME_LENGTH) {
            cb({
                success: false,
                errorMessage: 'Username too long'
            });
        }
        this.username = req.username;
        cb({ success: true });
    };

    onJoinCanvas = async (req: JoinCanvasRequest, cb: RequestCallback) => {
        if (!this.username) {
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
        // This will load the entire history into memory, so it relies on the
        // janitor service keeping the history squashed.
        cb({
            success: true,
            canvas,
            history
        });

        this.db.getHistoryFeed(this.canvasID).then(feed => {
            feed.each((err, change) => {
                if (change.new_val && !change.old_val) {
                    this.sock.emit('canvas:history:new', { entry: change.new_val });
                }
            });
        });
    };

    onDraw = async (req: DrawRequest, cb: RequestCallback) => {
        if (!this.username) {
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