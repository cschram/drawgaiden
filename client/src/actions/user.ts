import { push } from 'react-router-redux';
import { Response } from '../../../defs/protocol';

export function login(userName: string, redirect?: string) {
    return (dispatch, getState) => {
        dispatch({ type: 'LOGIN_STARTED' });
        let socket = getState().connection.socket;
        socket.emit('login', { userName }, (resp: Response) => {
            if (resp.success) {
                dispatch({
                    type: 'LOGIN_SUCCESS',
                    payload: userName
                });
                if (redirect) {
                    dispatch(push(redirect));
                }
            } else {
                dispatch({
                    type: 'LOGIN_FAILED',
                    payload: resp.errorMessage
                });
            }
        });
    };
}