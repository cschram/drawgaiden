import canvas from '../canvas';
import testData from '../../__testdata__/canvas';

describe('Canvas Reducer', () => {
    test('JOIN_CANVAS_STARTED', () => {
        const initialState = {
            lastCanvasID: '',
            canvas: null,
            history: [],
            latestEntry: null,
            users: [],
            loading: false
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
            loading: true
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
            loading: true
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
            loading: false
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
            loading: false
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
            loading: false
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
            loading: false
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
            loading: false
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
            loading: false
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
            loading: false
        };
        expect(canvas(initialState, action)).toEqual(expectedState);
    });
});