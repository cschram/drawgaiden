import { push } from 'react-router-redux';
import { HistoryEntry } from '../../../common/canvas';
import { Response, JoinCanvasResponse } from '../../../common/protocol';

export function joinCanvas(canvasID: string) {
    return (dispatch, getState) => {
        dispatch({ type: 'JOIN_CANVAS_STARTED' });
        let socket = getState().connection.socket;
        socket.emit('canvas:join', { canvasID }, (resp: JoinCanvasResponse) => {
            if (resp.success) {
                dispatch({
                    type: 'JOIN_CANVAS_SUCCESS',
                    payload: {
                        canvas: resp.canvas,
                        history: resp.history
                    }
                });
            } else {
                // dispatch({
                //     type: 'JOIN_CANVAS_FAILED',
                //     payload: resp.errorMessage
                // });
                dispatch(push('/404'));
            }
        });
    };
}

export function draw(entry: HistoryEntry) {
    return (dispatch, getState) => {
        let socket = getState().connection.socket;
        socket.emit('canvas:draw', { entry }, (resp: Response) => {
            if (!resp.success) {
                console.error(resp.errorMessage);
            }
        });
    }
}