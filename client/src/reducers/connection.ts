interface ConnectionState {
    socket: SocketIOClient.Socket;
}

const initialState: ConnectionState = {
    socket: null
};

export default function(state = initialState, { type, payload }): ConnectionState {
    switch (type) {
        case 'CONNECTED':
            return {
                socket: payload
            };

        case 'DISCONNECTED':
            return {
                socket: null
            };

        default:
            return state;
    }
}