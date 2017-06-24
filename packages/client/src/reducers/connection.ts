interface ConnectionState {
    socket: SocketIOClient.Socket;
    connected: boolean;
    connecting: boolean;
}

const initialState: ConnectionState = {
    socket: null,
    connected: false,
    connecting: false
};

export default function(state = initialState, { type, payload }): ConnectionState {
    switch (type) {
        case 'CONNECTING':
            return {
                socket: null,
                connected: false,
                connecting: true
            };

        case 'CONNECTED':
            return {
                socket: payload,
                connected: true,
                connecting: false
            };

        case 'DISCONNECTED':
            return {
                socket: null,
                connected: false,
                connecting: false
            };

        default:
            return state;
    }
}