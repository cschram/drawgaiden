interface UserState {
    userName: string;
}

const defaultState = {
    userName: ''
};

export default (state = defaultState, { type, payload }) => {
    return state;
}