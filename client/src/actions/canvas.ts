import { push } from 'react-router-redux';
import { HistoryEntry } from '../../../defs/canvas';
import { Coord } from '../../../defs/canvas';
import { Response, JoinCanvasResponse } from '../../../defs/protocol';

export function joinCanvas(canvasID: string) {
    return (dispatch, getState) => {
        dispatch({ type: 'JOIN_CANVAS_STARTED' });
        let socket = getState().connection.socket;
        socket.emit('canvas:join', {
            canvasID,
            callback(resp: JoinCanvasResponse) {
                if (resp.success) {
                    dispatch({
                        type: 'JOIN_CANVAS_SUCCESS',
                        payload: {
                            canvas: resp.canvas,
                            history: resp.history,
                            users: resp.users
                        }
                    });
                } else {
                    // dispatch({
                    //     type: 'JOIN_CANVAS_FAILED',
                    //     payload: resp.errorMessage
                    // });
                    dispatch(push('/404'));
                }
            }
        });
    };
}

export function draw(entry: HistoryEntry) {
    return (dispatch, getState) => {
        let socket = getState().connection.socket;
        socket.emit('canvas:draw', {
            entry,
            callback(resp: Response) {
                if (!resp.success) {
                    console.error(resp.errorMessage);
                }
            }
        });
    }
}

export function setMousePosition(coord: Coord) {
    return (dispatch, getState) => {
        let socket = getState().connection.socket;
        socket.emit('user:position:set', {
            coord,
            callback(resp: Response) {
                if (!resp.success) {
                    console.error(resp.errorMessage);
                }
            }
        });
    }
}