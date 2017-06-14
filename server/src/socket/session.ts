import * as SocketIO from 'socket.io';
import * as winston from 'winston';
import * as r from 'rethinkdb';
import { Connection } from '../lib/db';
import {
    Request,
    Response,
    LoginRequest,
    JoinCanvasRequest,
    JoinCanvasResponse,
    DrawRequest,
    NewHistoryEvent,
    SetPositionRequest
} from '../../../defs/protocol';
import {
    Canvas,
    HistoryEntry
} from '../../../defs/canvas';
import config from '../lib/config';

const usernameRe = /^[a-zA-Z0-9]{2,15}$/;

export default function session(sock: SocketIO.Socket, db: Connection, logger: winston.LoggerInstance) {
    let username = '';
    let canvasID = '';
    let feeds: r.Cursor[] = [];

    function clearFeeds() {
        feeds.forEach(feed => feed.close());
        feeds = [];
    }

    const handleErrors = (fn: Function) => {
        return async (req: Request) => {
            try {
                await fn.apply(this, req);
            } catch(error) {
                logger.error(error);
                req.callback({
                    success: false,
                    errorMessage: error.toString()
                });
            }
        }
    };

    const authCheck = (fn: Function) => {
        return async (req: Request) => {
            if (!username) {
                req.callback({
                    success: false,
                    errorMessage: 'Not authenticated'
                });
            } else {
                await fn(req);
            }
        }
    };

    const canvasCheck = (fn: Function) => {
        return async (req: Request) => {
            if (!canvasID) {
                req.callback({
                    success: false,
                    errorMessage: 'Not subscribed to a canvas'
                });
            } else {
                await fn(req);
            }
        }
    };

    sock.on('disconnect', () => {
        if (username) {
            db.deleteUser(username);
            clearFeeds();
            logger.info(`User "${username}" disconnected.`);
        } else {
            logger.info('Anonymous user disconnected.');
        }
    });

    sock.on('login', handleErrors(async (req: LoginRequest) => {
        if (username) {
            req.callback({
                success: false,
                errorMessage: 'Already authenticated'
            });
            return;
        }
        if (!usernameRe.test(req.username)) {
            req.callback({
                success: false,
                errorMessage: 'Invalid username (must be alphanumeric only with 2-15 characters)'
            });
            return;
        }
        await db.createUser(req.username);
        username = req.username;
        req.callback({ success: true });
    }));

    sock.on('canvas:create', handleErrors(authCheck(async (req: Request) => {
        await db.createCanvas(username);
        req.callback({ success: true });
    })));

    sock.on('canvas:join', handleErrors(authCheck(async (req: JoinCanvasRequest) => {
        let canvas = await db.getCanvas(req.canvasID);
        if (!canvas) {
            req.callback({
                success: false,
                errorMessage: 'Canvas not found'
            });
            return;
        }
        let history = await db.getHistory(req.canvasID);
        let users = await db.getUsers(req.canvasID);
        await db.setUserCanvas(username, req.canvasID);
        canvasID = req.canvasID;
        // This will load the entire history into memory, so it relies on the
        // janitor service keeping the history squashed.
        req.callback({
            success: true,
            canvas,
            history: await history.toArray(),
            users: await users.toArray()
        });

        // Stream new history entries to the client
        db.getHistoryFeed(canvasID).then(feed => {
            feeds.push(feed);
            feed.each((err, change) => {
                if (err) {
                    logger.error(err.toString());
                } else {
                    if (change.new_val && !change.old_val) {
                        sock.emit('canvas:history:new', { entry: change.new_val });
                    }
                }
            });
        });

        // Stream user updates to the client
        db.getUserFeed(canvasID).then(feed => {
            feeds.push(feed);
            feed.each((err, change) => {
                if (err) {
                    logger.error(err.toString());
                } else {
                    if (change.new_val && change.old_val) {
                        sock.emit('canvas:user:update', { user: change.new_val });
                    } else if (change.new_val && !change.old_val) {
                        sock.emit('canvas:user:join', { user: change.new_val });
                    } else if (!change.new_val && change.old_val) {
                        sock.emit('canvas:user:leave', { user: change.old_val });
                    }
                }
            });
        });
    })));

    sock.on('canvas:leave', handleErrors(authCheck(canvasCheck(async (req: Request) => {
        await db.setUserCanvas(username, '');
        canvasID = '';
        clearFeeds();
        req.callback({ success: true });
    }))));

    sock.on('canvas:draw', handleErrors(authCheck(canvasCheck(async (req: DrawRequest) => {
        await db.addHistory(req.entry);
        req.callback({ success: true });
    }))));

    sock.on('user:position:set', handleErrors(authCheck(canvasCheck((req: SetPositionRequest) => {
        db.setUserPosition(username, req.coord);
    }))));
}