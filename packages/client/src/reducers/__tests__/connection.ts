import connection from '../connection';

describe('Connection Reducer', () => {
    test('CONNECTING', () => {
        const initialState = {
            socket: null,
            connected: false,
            connecting: false
        };
        const action = {
            type: 'CONNECTING',
            payload: null
        };
        const expectedState = {
            socket: null,
            connected: false,
            connecting: true
        };
        expect(connection(initialState, action)).toEqual(expectedState);
    });

    test('CONNECTED', () => {
        const initialState = {
            socket: null,
            connected: false,
            connecting: true
        };
        const action = {
            type: 'CONNECTED',
            payload: null
        };
        const expectedState = {
            socket: null,
            connected: true,
            connecting: false
        };
        expect(connection(initialState, action)).toEqual(expectedState);
    });

    test('DISCONNECTED', () => {
        const initialState = {
            socket: null,
            connected: true,
            connecting: false
        };
        const action = {
            type: 'DISCONNECTED',
            payload: null
        };
        const expectedState = {
            socket: null,
            connected: false,
            connecting: false
        };
        expect(connection(initialState, action)).toEqual(expectedState);
    });
});