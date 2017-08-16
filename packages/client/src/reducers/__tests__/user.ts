import user from '../user';

describe('User Reducer', () => {
    test('LOGIN_STARTED', () => {
        const initialState = {
            username: '',
            loggingIn: false,
            loginError: ''
        };
        const action = {
            type: 'LOGIN_STARTED',
            payload: null
        };
        const expectedState = {
            username: '',
            loggingIn: true,
            loginError: ''
        };
        expect(user(initialState, action)).toEqual(expectedState);
    });

    test('LOGIN_SUCCESS', () => {
        const initialState = {
            username: '',
            loggingIn: true,
            loginError: ''
        };
        const action = {
            type: 'LOGIN_SUCCESS',
            payload: 'username'
        };
        const expectedState = {
            username: 'username',
            loggingIn: false,
            loginError: ''
        };
        expect(user(initialState, action)).toEqual(expectedState);
    });

    test('LOGIN_FAILED', () => {
        const initialState = {
            username: '',
            loggingIn: true,
            loginError: ''
        };
        const action = {
            type: 'LOGIN_FAILED',
            payload: 'Unknown error.'
        };
        const expectedState = {
            username: '',
            loggingIn: false,
            loginError: 'Unknown error.'
        };
        expect(user(initialState, action)).toEqual(expectedState);
    });

    test('LOGOUT', () => {
        const initialState = {
            username: 'username',
            loggingIn: false,
            loginError: ''
        };
        const action = {
            type: 'LOGOUT',
            payload: null
        };
        const expectedState = {
            username: '',
            loggingIn: false,
            loginError: ''
        };
        expect(user(initialState, action)).toEqual(expectedState);
    });
});