import { Canvas, HistoryEntry } from '../../../defs/canvas';

interface CanvasState {
    canvas: Canvas;
    history: HistoryEntry[];
    loading: boolean;
}

const initialState: CanvasState = {
    canvas: null,
    history: [],
    loading: false
};

export default function(state = initialState, { type, payload }): CanvasState {
    switch (type) {
        case 'JOIN_CANVAS_STARTED':
            return {
                canvas: null,
                history: [],
                loading: true
            };

        case 'JOIN_CANVAS_SUCCESS':
            return {
                canvas: payload.canvas,
                history: payload.history,
                loading: false
            };

        case 'CANVAS_HISTORY_NEW':
            return {
                canvas: state.canvas,
                history: state.history.concat([payload]),
                loading: false
            };

        default:
            return state;
    }
}