interface UserState {
    userName: string;
}

const defaultState: UserState = {
    userName: ''
};

export default (state = defaultState, { type, payload }): UserState => {
    return state;
}