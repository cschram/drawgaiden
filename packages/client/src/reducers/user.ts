function getSessionItem(name: string) {
    if (window.sessionStorage) {
        return sessionStorage.getItem(name);
    }
    return null;
}

function setSessionItem(name: string, value: string) {
    if (window.sessionStorage) {
        sessionStorage.setItem(name, value);
    }
}

function removeSessionItem(name: string) {
    if (window.sessionStorage) {
        sessionStorage.removeItem(name);
    }
}

interface UserState {
    username: string;
    loggingIn: boolean;
    loginError: string;
}

const defaultState: UserState = {
    username: getSessionItem('username') || '',
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
            setSessionItem('username', payload);
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
            removeSessionItem('username');
            return {
                username: '',
                loggingIn: false,
                loginError: ''
            };

        default:
            return state;
    }
}