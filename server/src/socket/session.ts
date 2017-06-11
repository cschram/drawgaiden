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
        this.sock.on('canvas:leave', this.onLeaveCanvas);
        this.sock.on('canvas:draw', this.onDraw);
    }

    onDisconnect = () => {
        if (this.username) {
            this.db.deleteUser(this.username);
            this.logger.info(`User "${this.username}" disconnected.`);
        } else {
            this.logger.info('Anonymous user disconnected.');
        }
    };

    onLogin = async (req: LoginRequest, cb: RequestCallback) => {
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
        try {
            await this.db.createUser(req.username);
            this.username = req.username;
            cb({ success: true });
        } catch(e) {
            cb({
                success: false,
                errorMessage: e
            });
        }
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
        let users = await this.db.getUsers(this.canvasID);
        await this.db.setUserCanvas(this.username, this.canvasID);
        // This will load the entire history into memory, so it relies on the
        // janitor service keeping the history squashed.
        cb({
            success: true,
            canvas,
            history,
            users
        });

        // Stream new history entries to the client
        this.db.getHistoryFeed(this.canvasID).then(feed => {
            feed.each((err, change) => {
                if (err) {
                    this.logger.error(err.toString());
                } else {
                    if (change.new_val && !change.old_val) {
                        this.sock.emit('canvas:history:new', { entry: change.new_val });
                    }
                }
            });
        });

        // Stream user updates to the client
        this.db.getUserFeed(this.canvasID).then(feed => {
            feed.each((err, change) => {
                if (err) {
                    this.logger.error(err.toString());
                } else {
                    if (change.new_val && change.old_val) {
                        this.sock.emit('canvas:user:update', { user: change.new_val });
                    } else if (change.new_val && !change.old_val) {
                        this.sock.emit('canvas:user:join', { user: change.new_val });
                    } else if (!change.new_val && change.old_val) {
                        this.sock.emit('canvas:user:leave', { user: change.old_val });
                    }
                }
            });
        });
    };

    onLeaveCanvas = async (cb: RequestCallback) => {
        if (!this.username) {
            cb({
                success: false,
                errorMessage: 'Not authenticated'
            });
        }
        if (!this.canvasID) {
            cb({
                success: false,
                errorMessage: 'Not subscribed to a canvas'
            });
        }
        await this.db.setUserCanvas(this.username, '');
        this.canvasID = '';
        cb({ success: true });
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