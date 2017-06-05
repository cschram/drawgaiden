interface UserState {
    userName: string;
    loggingIn: boolean;
    loginError: string;
}

const defaultState: UserState = {
    userName: sessionStorage.getItem('username') || '',
    loggingIn: false,
    loginError: ''
};

export default (state = defaultState, { type, payload }): UserState => {
    switch (type) {
        case 'LOGIN_STARTED':
            return {
                userName: '',
                loggingIn: true,
                loginError: ''
            };

        case 'LOGIN_SUCCESS':
            sessionStorage.setItem('username', payload);
            return {
                userName: payload,
                loggingIn: false,
                loginError: ''
            };

        case 'LOGIN_FAILED':
            return {
                userName: '',
                loggingIn: false,
                loginError: payload
            };

        case 'LOGOUT':
            sessionStorage.removeItem('username');
            return {
                userName: '',
                loggingIn: false,
                loginError: ''
            };

        default:
            return state;
    }
}