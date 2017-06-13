import { Canvas, HistoryEntry, User } from '../../../defs/canvas';

interface CanvasState {
    canvas: Canvas;
    history: HistoryEntry[];
    users: User[];
    loading: boolean;
}

const initialState: CanvasState = {
    canvas: null,
    history: [],
    users: [],
    loading: false
};

export default function(state = initialState, { type, payload }): CanvasState {
    switch (type) {
        case 'JOIN_CANVAS_STARTED':
            return {
                canvas: null,
                history: [],
                users: [],
                loading: true
            };

        case 'JOIN_CANVAS_SUCCESS':
            return {
                canvas: payload.canvas,
                history: payload.history,
                users: payload.users,
                loading: false
            };

        case 'CANVAS_HISTORY_NEW':
            return {
                canvas: state.canvas,
                history: state.history.concat([payload]),
                users: state.users,
                loading: false
            };

        case 'CANVAS_USER_JOIN':
            return {
                canvas: state.canvas,
                history: state.history,
                users: state.users.concat([payload]),
                loading: false
            };

        case 'CANVAS_USER_LEAVE':
            return {
                canvas: state.canvas,
                history: state.history,
                users: state.users.filter(user => user.username !== payload.username),
                loading: false
            };

        case 'CANVAS_USER_UPDATE':
            return {
                canvas: state.canvas,
                history: state.history,
                users: state.users.map(user => {
                    if (user.username === payload.username) {
                        return payload;
                    }
                    return user;
                }),
                loading: false
            };

        default:
            return state;
    }
}