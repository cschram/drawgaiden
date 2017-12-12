import * as SocketIO from 'socket.io';
import * as winston from 'winston';
import * as r from 'rethinkdb';
import * as cuid from 'cuid';
import * as redis from 'redis';
import { Connection } from '../lib/db';
import { Protocol } from '@drawgaiden/common';
import config from '../lib/config';
const usernameRe = /^[a-zA-Z0-9]{2,15}$/;

interface SessionArgs {
    sock: SocketIO.Socket;
    dbConn: Connection;
    redisConn: redis.RedisClient;
    logger: winston.LoggerInstance;
}

export default function session(args: SessionArgs) {
    const { sock, dbConn, logger } = args;
    let username = '';
    let canvasID = '';
    let feeds: r.Cursor[] = [];

    function clearFeeds() {
        feeds.forEach(feed => feed.close());
        feeds = [];
    }

    const handleErrors = (fn: Function) => {
        return async (...args: any[]) => {
            let cb: Protocol.Callback;
            try {
                await fn.apply(null, args);
            } catch(error) {
                logger.error(error);
                args[args.length - 1]({
                    success: false,
                    errorMessage: error.toString()
                });
            }
        }
    };

    const authCheck = (fn: Function) => {
        return async (...args: any[]) => {
            if (!username) {
                args[args.length - 1]({
                    success: false,
                    errorMessage: 'Not authenticated'
                });
            } else {
                await fn.apply(null, args);
            }
        }
    };

    const canvasCheck = (fn: Function) => {
        return async (...args: any[]) => {
            if (!canvasID) {
                args[args.length - 1]({
                    success: false,
                    errorMessage: 'Not subscribed to a canvas'
                });
            } else {
                await fn.apply(null, args);
            }
        }
    };

    sock.on('disconnect', () => {
        if (username) {
            dbConn.deleteUser(username);
            clearFeeds();
            logger.info(`User "${username}" disconnected.`);
        } else {
            logger.info('Anonymous user disconnected.');
        }
    });

    sock.on('login', handleErrors(async (req: Protocol.LoginRequest, cb: Protocol.Callback) => {
        if (username) {
            cb({
                success: false,
                errorMessage: 'Already authenticated'
            });
            return;
        }
        if (!usernameRe.test(req.username)) {
            cb({
                success: false,
                errorMessage: 'Invalid username (must be alphanumeric only with 2-15 characters)'
            });
            return;
        }
        await dbConn.createUser(req.username);
        username = req.username;
        cb({ success: true });
    }));

    sock.on('canvas:create', handleErrors(authCheck(async (req: Protocol.CreateCanvasRequest, cb: Protocol.Callback<Protocol.CreateCanvasResponse>) => {
        const id = cuid();
        await dbConn.createCanvas(id);
        cb({
            success: true,
            id
        });
    })));

    sock.on('canvas:join', handleErrors(authCheck(async (req: Protocol.JoinCanvasRequest, cb: Protocol.Callback<Protocol.JoinCanvasResponse>) => {
        // The typing for r.Cursor can't be coerced to the actual object
        // type you want, so it needs to be converted to any type first.
        let canvas: any = await dbConn.getCanvas(req.canvasID);
        if (!canvas) {
            cb({
                success: false,
                errorMessage: 'Canvas not found'
            });
            return;
        }
        let history = await dbConn.getHistory(req.canvasID);
        let users = await dbConn.getUsers(req.canvasID);
        await dbConn.setUserCanvas(username, req.canvasID);
        canvasID = req.canvasID;
        // This will load the entire history into memory, so it relies on the
        // janitor service keeping the history squashed.
        cb({
            success: true,
            canvas,
            history: await history.toArray(),
            users: await users.toArray()
        });

        // Stream new history entries to the client
        dbConn.getHistoryFeed(canvasID).then(feed => {
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
        dbConn.getUserFeed(canvasID).then(feed => {
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

    sock.on('canvas:leave', handleErrors(authCheck(canvasCheck(async (cb: Protocol.Callback) => {
        await dbConn.setUserCanvas(username, '');
        canvasID = '';
        clearFeeds();
        cb({ success: true });
    }))));

    sock.on('canvas:draw', handleErrors(authCheck(canvasCheck(async (req: Protocol.DrawRequest, cb: Protocol.Callback) => {
        req.entry.id = cuid();
        await dbConn.addHistory(req.entry);
        cb({ success: true });
    }))));

    sock.on('user:position:set', handleErrors(authCheck(canvasCheck((req: Protocol.SetPositionRequest, cb: Protocol.Callback) => {
        dbConn.setUserPosition(username, req.coord);
        cb({ success: true });
    }))));
}