interface UserState {
    username: string;
    loggingIn: boolean;
    loginError: string;
}

const defaultState: UserState = {
    username: sessionStorage.getItem('username') || '',
    loggingIn: false,
    loginError: ''
};

export default (state = defaultState, { type, payload }): UserState => {
    switch (type) {
        case 'LOGIN_STARTED':
            return {
                username: '',
                loggingIn: true,
                loginError: ''
            };

        case 'LOGIN_SUCCESS':
            sessionStorage.setItem('username', payload);
            return {
                username: payload,
                loggingIn: false,
                loginError: ''
            };

        case 'LOGIN_FAILED':
            return {
                username: '',
                loggingIn: false,
                loginError: payload
            };

        case 'LOGOUT':
            sessionStorage.removeItem('username');
            return {
                username: '',
                loggingIn: false,
                loginError: ''
            };

        default:
            return state;
    }
}