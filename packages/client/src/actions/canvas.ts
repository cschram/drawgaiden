import { push } from 'react-router-redux';
import { HistoryEntry, Coord, Protocol } from '@drawgaiden/common';

export function createCanvas() {
    return (dispatch, getState) => {
        let socket = getState().connection.socket;
        socket.emit('canvas:create', {}, (resp: Protocol.CreateCanvasResponse) => {
            if (resp.success) {
                dispatch(push(`/canvas/${resp.id}`));
            } else {
                console.error(resp.errorMessage);
            }
        });
    }
}

export function joinCanvas(canvasID: string) {
    return (dispatch, getState) => {
        dispatch({ type: 'JOIN_CANVAS_STARTED' });
        let socket = getState().connection.socket;
        socket.emit('canvas:join', { canvasID }, (resp: Protocol.JoinCanvasResponse) => {
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
                dispatch(push('/404'));
            }
        });
    };
}

export function leaveCanvas() {
    return (dispatch, getState) => {
        dispatch({ type: 'LEAVE_CANVAS' });
    };
}

export function draw(entry: HistoryEntry) {
    return (dispatch, getState) => {
        let socket = getState().connection.socket;
        socket.emit('canvas:draw', { entry }, (resp: Protocol.Response) => {
            if (!resp.success) {
                console.error(resp.errorMessage);
            }
        });
    }
}

export function setMousePosition(coord: Coord) {
    return (dispatch, getState) => {
        let socket = getState().connection.socket;
        socket.emit('user:position:set', { coord }, (resp: Protocol.Response) => {
            if (!resp.success) {
                console.error(resp.errorMessage);
            }
        });
    }
}

export function changeTool(tool: string) {
    return {
        type: 'CANVAS_CHANGE_TOOL',
        payload: tool
    };
}

export function changeLayer(layer: number) {
    return {
        type: 'CANVAS_CHANGE_LAYER',
        payload: layer
    };
}

export function changeStrokeColor(color: string) {
    return {
        type: 'CANVAS_CHANGE_STROKE_COLOR',
        payload: color
    };
}

export function changeFillColor(color: string) {
    return {
        type: 'CANVAS_CHANGE_FILL_COLOR',
        payload: color
    };
}

export function changeToolSize(size: number) {
    return {
        type: 'CANVAS_CHANGE_TOOL_SIZE',
        payload: size
    };
}

export function changeToolOpacity(opacity: number) {
    return {
        type: 'CANVAS_CHANGE_TOOL_OPACITY',
        payload: opacity
    };
}

export function changeToolSmoothness(smoothness: number) {
    return {
        type: 'CANVAS_CHANGE_TOOL_SMOOTHNESS',
        payload: smoothness
    };
}