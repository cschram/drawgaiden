import canvas from '../canvas';
import testData from '../../../test/data/canvas';

describe('Canvas Reducer', () => {
    test('JOIN_CANVAS_STARTED', () => {
        const initialState = {
            lastCanvasID: '',
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
        const action = {
            type: 'JOIN_CANVAS_STARTED',
            payload: null
        };
        const expectedState = {
            lastCanvasID: '',
            canvas: null,
            history: [],
            latestEntry: null,
            users: [],
            loading: true,
            currentTool: 'pencil',
            currentLayer: 0,
            strokeColor: '#000000',
            fillColor: '#ffffff',
            toolSize: 1,
            toolOpacity: 100,
            toolSmoothness: 80
        };
        expect(canvas(initialState, action)).toEqual(expectedState);
    });

    test('JOIN_CANVAS_SUCCESS', () => {
        const initialState = {
            lastCanvasID: '',
            canvas: null,
            history: [],
            latestEntry: null,
            users: [],
            loading: true,
            currentTool: 'pencil',
            currentLayer: 0,
            strokeColor: '#000000',
            fillColor: '#ffffff',
            toolSize: 1,
            toolOpacity: 100,
            toolSmoothness: 80
        };
        const action = {
            type: 'JOIN_CANVAS_SUCCESS',
            payload: {
                canvas: testData.canvas,
                history: testData.history,
                users: testData.users
            }
        };
        const expectedState = {
            lastCanvasID: testData.canvas.id,
            canvas: testData.canvas,
            history: testData.history,
            latestEntry: null,
            users: testData.users,
            loading: false,
            currentTool: 'pencil',
            currentLayer: 0,
            strokeColor: '#000000',
            fillColor: '#ffffff',
            toolSize: 1,
            toolOpacity: 100,
            toolSmoothness: 80
        };
        expect(canvas(initialState, action)).toEqual(expectedState);
    });

    test('CANVAS_HISTORY_NEW', () => {
        const initialState = {
            lastCanvasID: testData.canvas.id,
            canvas: testData.canvas,
            history: testData.history,
            latestEntry: null,
            users: testData.users,
            loading: false,
            currentTool: 'pencil',
            currentLayer: 0,
            strokeColor: '#000000',
            fillColor: '#ffffff',
            toolSize: 1,
            toolOpacity: 100,
            toolSmoothness: 80
        };
        const action = {
            type: 'CANVAS_HISTORY_NEW',
            payload: testData.newEntry
        };
        const expectedState = {
            lastCanvasID: testData.canvas.id,
            canvas: testData.canvas,
            history: testData.history,
            latestEntry: testData.newEntry,
            users: testData.users,
            loading: false,
            currentTool: 'pencil',
            currentLayer: 0,
            strokeColor: '#000000',
            fillColor: '#ffffff',
            toolSize: 1,
            toolOpacity: 100,
            toolSmoothness: 80
        };
        expect(canvas(initialState, action)).toEqual(expectedState);
    });

    test('CANVAS_USER_JOIN', () => {
        const initialState = {
            lastCanvasID: testData.canvas.id,
            canvas: testData.canvas,
            history: testData.history,
            latestEntry: null,
            users: testData.users,
            loading: false,
            currentTool: 'pencil',
            currentLayer: 0,
            strokeColor: '#000000',
            fillColor: '#ffffff',
            toolSize: 1,
            toolOpacity: 100,
            toolSmoothness: 80
        };
        const action = {
            type: 'CANVAS_USER_JOIN',
            payload: testData.newUser
        };
        const expectedState = {
            lastCanvasID: testData.canvas.id,
            canvas: testData.canvas,
            history: testData.history,
            latestEntry: null,
            users: testData.users.concat([testData.newUser]),
            loading: false,
            currentTool: 'pencil',
            currentLayer: 0,
            strokeColor: '#000000',
            fillColor: '#ffffff',
            toolSize: 1,
            toolOpacity: 100,
            toolSmoothness: 80
        };
        expect(canvas(initialState, action)).toEqual(expectedState);
    });

    test('CANVAS_USER_UPDATE', () => {
        const initialState = {
            lastCanvasID: testData.canvas.id,
            canvas: testData.canvas,
            history: testData.history,
            latestEntry: null,
            users: testData.users,
            loading: false,
            currentTool: 'pencil',
            currentLayer: 0,
            strokeColor: '#000000',
            fillColor: '#ffffff',
            toolSize: 1,
            toolOpacity: 100,
            toolSmoothness: 80
        };
        const action = {
            type: 'CANVAS_USER_UPDATE',
            payload: testData.updatedUser
        };
        const expectedState = {
            lastCanvasID: testData.canvas.id,
            canvas: testData.canvas,
            history: testData.history,
            latestEntry: null,
            users: [testData.updatedUser],
            loading: false,
            currentTool: 'pencil',
            currentLayer: 0,
            strokeColor: '#000000',
            fillColor: '#ffffff',
            toolSize: 1,
            toolOpacity: 100,
            toolSmoothness: 80
        };
        expect(canvas(initialState, action)).toEqual(expectedState);
    });

    test('CANVAS_CHANGE_TOOL', () => {
        const initialState = {
            lastCanvasID: testData.canvas.id,
            canvas: testData.canvas,
            history: testData.history,
            latestEntry: null,
            users: testData.users,
            loading: false,
            currentTool: 'pencil',
            currentLayer: 0,
            strokeColor: '#000000',
            fillColor: '#ffffff',
            toolSize: 1,
            toolOpacity: 100,
            toolSmoothness: 80
        };
        const action = {
            type: 'CANVAS_CHANGE_TOOL',
            payload: 'rectangle'
        };
        const expectedState = {
            lastCanvasID: testData.canvas.id,
            canvas: testData.canvas,
            history: testData.history,
            latestEntry: null,
            users: testData.users,
            loading: false,
            currentTool: 'rectangle',
            currentLayer: 0,
            strokeColor: '#000000',
            fillColor: '#ffffff',
            toolSize: 1,
            toolOpacity: 100,
            toolSmoothness: 80
        };
        expect(canvas(initialState, action)).toEqual(expectedState);
    });

    test('CANVAS_CHANGE_LAYER', () => {
        const initialState = {
            lastCanvasID: testData.canvas.id,
            canvas: testData.canvas,
            history: testData.history,
            latestEntry: null,
            users: testData.users,
            loading: false,
            currentTool: 'pencil',
            currentLayer: 0,
            strokeColor: '#000000',
            fillColor: '#ffffff',
            toolSize: 1,
            toolOpacity: 100,
            toolSmoothness: 80
        };
        const action = {
            type: 'CANVAS_CHANGE_LAYER',
            payload: 1
        };
        const expectedState = {
            lastCanvasID: testData.canvas.id,
            canvas: testData.canvas,
            history: testData.history,
            latestEntry: null,
            users: testData.users,
            loading: false,
            currentTool: 'pencil',
            currentLayer: 1,
            strokeColor: '#000000',
            fillColor: '#ffffff',
            toolSize: 1,
            toolOpacity: 100,
            toolSmoothness: 80
        };
        expect(canvas(initialState, action)).toEqual(expectedState);
    });

    test('CANVAS_CHANGE_STROKE_COLOR', () => {
        const initialState = {
            lastCanvasID: testData.canvas.id,
            canvas: testData.canvas,
            history: testData.history,
            latestEntry: null,
            users: testData.users,
            loading: false,
            currentTool: 'pencil',
            currentLayer: 0,
            strokeColor: '#000000',
            fillColor: '#ffffff',
            toolSize: 1,
            toolOpacity: 100,
            toolSmoothness: 80
        };
        const action = {
            type: 'CANVAS_CHANGE_STROKE_COLOR',
            payload: '#999999'
        };
        const expectedState = {
            lastCanvasID: testData.canvas.id,
            canvas: testData.canvas,
            history: testData.history,
            latestEntry: null,
            users: testData.users,
            loading: false,
            currentTool: 'pencil',
            currentLayer: 0,
            strokeColor: '#999999',
            fillColor: '#ffffff',
            toolSize: 1,
            toolOpacity: 100,
            toolSmoothness: 80
        };
        expect(canvas(initialState, action)).toEqual(expectedState);
    });

    test('CANVAS_CHANGE_FILL_COLOR', () => {
        const initialState = {
            lastCanvasID: testData.canvas.id,
            canvas: testData.canvas,
            history: testData.history,
            latestEntry: null,
            users: testData.users,
            loading: false,
            currentTool: 'pencil',
            currentLayer: 0,
            strokeColor: '#000000',
            fillColor: '#ffffff',
            toolSize: 1,
            toolOpacity: 100,
            toolSmoothness: 80
        };
        const action = {
            type: 'CANVAS_CHANGE_FILL_COLOR',
            payload: '#eeeeee'
        };
        const expectedState = {
            lastCanvasID: testData.canvas.id,
            canvas: testData.canvas,
            history: testData.history,
            latestEntry: null,
            users: testData.users,
            loading: false,
            currentTool: 'pencil',
            currentLayer: 0,
            strokeColor: '#000000',
            fillColor: '#eeeeee',
            toolSize: 1,
            toolOpacity: 100,
            toolSmoothness: 80
        };
        expect(canvas(initialState, action)).toEqual(expectedState);
    });

    test('CANVAS_CHANGE_TOOL_SIZE', () => {
        const initialState = {
            lastCanvasID: testData.canvas.id,
            canvas: testData.canvas,
            history: testData.history,
            latestEntry: null,
            users: testData.users,
            loading: false,
            currentTool: 'pencil',
            currentLayer: 0,
            strokeColor: '#000000',
            fillColor: '#ffffff',
            toolSize: 1,
            toolOpacity: 100,
            toolSmoothness: 80
        };
        const action = {
            type: 'CANVAS_CHANGE_TOOL_SIZE',
            payload: 5
        };
        const expectedState = {
            lastCanvasID: testData.canvas.id,
            canvas: testData.canvas,
            history: testData.history,
            latestEntry: null,
            users: testData.users,
            loading: false,
            currentTool: 'pencil',
            currentLayer: 0,
            strokeColor: '#000000',
            fillColor: '#ffffff',
            toolSize: 5,
            toolOpacity: 100,
            toolSmoothness: 80
        };
        expect(canvas(initialState, action)).toEqual(expectedState);
    });

    test('CANVAS_CHANGE_TOOL_OPACITY', () => {
        const initialState = {
            lastCanvasID: testData.canvas.id,
            canvas: testData.canvas,
            history: testData.history,
            latestEntry: null,
            users: testData.users,
            loading: false,
            currentTool: 'pencil',
            currentLayer: 0,
            strokeColor: '#000000',
            fillColor: '#ffffff',
            toolSize: 1,
            toolOpacity: 100,
            toolSmoothness: 80
        };
        const action = {
            type: 'CANVAS_CHANGE_TOOL_OPACITY',
            payload: 50
        };
        const expectedState = {
            lastCanvasID: testData.canvas.id,
            canvas: testData.canvas,
            history: testData.history,
            latestEntry: null,
            users: testData.users,
            loading: false,
            currentTool: 'pencil',
            currentLayer: 0,
            strokeColor: '#000000',
            fillColor: '#ffffff',
            toolSize: 1,
            toolOpacity: 50,
            toolSmoothness: 80
        };
        expect(canvas(initialState, action)).toEqual(expectedState);
    });

    test('CANVAS_CHANGE_TOOL_SMOOTHNESS', () => {
        const initialState = {
            lastCanvasID: testData.canvas.id,
            canvas: testData.canvas,
            history: testData.history,
            latestEntry: null,
            users: testData.users,
            loading: false,
            currentTool: 'pencil',
            currentLayer: 0,
            strokeColor: '#000000',
            fillColor: '#ffffff',
            toolSize: 1,
            toolOpacity: 100,
            toolSmoothness: 80
        };
        const action = {
            type: 'CANVAS_CHANGE_TOOL_SMOOTHNESS',
            payload: 50
        };
        const expectedState = {
            lastCanvasID: testData.canvas.id,
            canvas: testData.canvas,
            history: testData.history,
            latestEntry: null,
            users: testData.users,
            loading: false,
            currentTool: 'pencil',
            currentLayer: 0,
            strokeColor: '#000000',
            fillColor: '#ffffff',
            toolSize: 1,
            toolOpacity: 100,
            toolSmoothness: 50
        };
        expect(canvas(initialState, action)).toEqual(expectedState);
    });
});