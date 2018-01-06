import { Canvas, HistoryEntry, User } from '@drawgaiden/common';
import { getSessionItem, setSessionItem } from '../lib/session';

interface CanvasState {
    lastCanvasID: string;
    canvas: Canvas;
    history: HistoryEntry[];
    latestEntry: HistoryEntry;
    users: User[];
    loading: boolean;
    currentTool: string;
    currentLayer: number;
    strokeColor: string;
    fillColor: string;
    toolSize: number;
    toolOpacity: number;
    toolSmoothness: number
}

const initialState: CanvasState = {
    lastCanvasID: getSessionItem('lastCanvasID') || '',
    canvas: null,
    history: [],
    latestEntry: null,
    users: [],
    loading: false,
    currentTool: 'pencil',
    currentLayer: 0,
    strokeColor: '#000000',
    fillColor: '#ffffff',
    toolSize: 1,
    toolOpacity: 100,
    toolSmoothness: 80
};

export default function(state = initialState, { type, payload }): CanvasState {
    switch (type) {
        case 'JOIN_CANVAS_STARTED':
            return Object.assign({}, initialState, {
                loading: true
            });

        case 'JOIN_CANVAS_SUCCESS':
            setSessionItem('lastCanvasID', payload.canvas.id);
            return Object.assign({}, initialState, {
                lastCanvasID: payload.canvas.id,
                canvas: payload.canvas,
                history: payload.history,
                users: payload.users,
                loading: false
            });

        case 'LEAVE_CANVAS':
            return Object.assign({}, state, {
                canvas: null,
                history: [],
                latestEntry: null,
                users: []
            });

        case 'CANVAS_HISTORY_NEW':
            return Object.assign({}, state, {
                latestEntry: payload
            });

        case 'CANVAS_USER_JOIN':
            return Object.assign({}, state, {
                users: state.users.concat([payload])
            });

        case 'CANVAS_USER_LEAVE':
            return Object.assign({}, state, {
                users: state.users.filter(user => user.username !== payload.username)
            });

        case 'CANVAS_USER_UPDATE':
            return Object.assign({}, state, {
                users: state.users.map(user => {
                    if (user.username === payload.username) {
                        return payload;
                    }
                    return user;
                })
            });

        case 'CANVAS_CHANGE_TOOL':
            return Object.assign({}, state, {
                currentTool: payload
            });

        case 'CANVAS_CHANGE_LAYER':
            return Object.assign({}, state, {
                currentLayer: payload
            });

        case 'CANVAS_CHANGE_STROKE_COLOR':
            return Object.assign({}, state, {
                strokeColor: payload
            });

        case 'CANVAS_CHANGE_FILL_COLOR':
            return Object.assign({}, state, {
                fillColor: payload
            });

        case 'CANVAS_CHANGE_TOOL_SIZE':
            return Object.assign({}, state, {
                toolSize: payload
            });

        case 'CANVAS_CHANGE_TOOL_OPACITY':
            return Object.assign({}, state, {
                toolOpacity: payload
            });

        case 'CANVAS_CHANGE_TOOL_SMOOTHNESS':
            return Object.assign({}, state, {
                toolSmoothness: payload
            });

        default:
            return state;
    }
}