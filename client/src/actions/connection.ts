import io from 'socket.io-client';
import { Response, NewHistoryEvent, UserEvent } from '../../../defs/protocol';
import config from '../../../config/client.json';

export function connect() {
    return (dispatch, getState) => {
        dispatch({ type: 'CONNECTING' });
        let socket = io(config.socketAPI);

        socket.on('connect', () => {
            let username = getState().user.username;
            if (username) {
                socket.emit('login', { username }, (resp: Response) => {
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

        socket.on('canvas:history:new', (event: NewHistoryEvent) => {
            dispatch({
                type: 'CANVAS_HISTORY_NEW',
                payload: event.entry
            });
        });

        socket.on('canvas:user:join', (event: UserEvent) => {
            dispatch({
                type: 'CANVAS_USER_JOIN',
                payload: event.user
            });
        });

        socket.on('canvas:user:leave', (event: UserEvent) => {
            dispatch({
                type: 'CANVAS_USER_LEAVE',
                payload: event.user
            });
        });

        socket.on('canvas:user:update', (event: UserEvent) => {
            dispatch({
                type: 'CANVAS_USER_UPDATE',
                payload: event.user
            });
        });
    }
}