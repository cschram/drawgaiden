import { Canvas, HistoryEntry, User } from '../../../common/canvas';

interface CanvasState {
    canvas: Canvas;
    history: HistoryEntry[];
    latestEntry: HistoryEntry;
    users: User[];
    loading: boolean;
}

const initialState: CanvasState = {
    canvas: null,
    history: [],
    latestEntry: null,
    users: [],
    loading: false
};

export default function(state = initialState, { type, payload }): CanvasState {
    switch (type) {
        case 'JOIN_CANVAS_STARTED':
            return Object.assign({}, initialState, {
                loading: true
            });

        case 'JOIN_CANVAS_SUCCESS':
            return Object.assign({}, initialState, {
                canvas: payload.canvas,
                history: payload.history,
                users: payload.users,
                loading: false
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

        default:
            return state;
    }
}