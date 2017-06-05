import io from 'socket.io-client';
import { Response, NewHistoryEvent } from '../../../common/protocol';
import config from '../../../config/client.json';

export function connect() {
    return (dispatch, getState) => {
        dispatch({ type: 'CONNECTING' });
        let socket = io(config.socketAPI);

        socket.on('connect', () => {
            let userName = getState().user.userName;
            if (userName) {
                socket.emit('login', { userName }, (resp: Response) => {
                    if (!resp.success) {
                        dispatch({ type: 'LOGOUT' });
                    }
                    dispatch({
                        type: 'CONNECTED',
                        payload: socket
                    });
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
    }
}