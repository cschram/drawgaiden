import io from 'socket.io-client';
import { Protocol } from '@drawgaiden/common';

export function connect() {
    return (dispatch, getState) => {
        dispatch({ type: 'CONNECTING' });
        const socket = io();

        socket.on('connect', () => {
            let username = getState().user.username;
            if (username) {
                socket.emit('login', { username }, (resp: Protocol.Response) => {
                    if (!resp.success) {
                        dispatch({ type: 'LOGOUT' });
                    } else {
                        dispatch({
                            type: 'CONNECTED',
                            payload: socket
                        });
                    }
                });
            } else {
                dispatch({
                    type: 'CONNECTED',
                    payload: socket
                });
            }
        });

        socket.on('disconnect', () => {
            dispatch({ type: 'DISCONNECTED' });
        });

        socket.on('canvas:history:new', (event: Protocol.NewHistoryEvent) => {
            dispatch({
                type: 'CANVAS_HISTORY_NEW',
                payload: event.entry
            });
        });

        socket.on('canvas:user:join', (event: Protocol.UserEvent) => {
            dispatch({
                type: 'CANVAS_USER_JOIN',
                payload: event.user
            });
        });

        socket.on('canvas:user:leave', (event: Protocol.UserEvent) => {
            dispatch({
                type: 'CANVAS_USER_LEAVE',
                payload: event.user
            });
        });

        socket.on('canvas:user:update', (event: Protocol.UserEvent) => {
            dispatch({
                type: 'CANVAS_USER_UPDATE',
                payload: event.user
            });
        });
    }
}