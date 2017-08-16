import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { connect as socketConnect } from '../../actions/connection';
import Loading from '../loading';

interface AppProps {
    connected: boolean;
    connecting: boolean;
    connect: () => void;

    username: string;
    loginRedirect: () => void;

    isLogin: boolean;
}

export class App extends React.Component<AppProps> {
    private checkConnection() {
        if (this.props.connected) {
            this.checkLogin();
        } else if (!this.props.connecting) {
            this.props.connect();
        }
    }

    private checkLogin() {
        if (!this.props.username && !this.props.isLogin) {
            this.props.loginRedirect();
        }
    }

    componentDidMount() {
        this.checkConnection();
    }

    componentDidUpdate() {
        this.checkConnection();
    }

    render() {
        if (!this.props.connected || (!this.props.username && !this.props.isLogin)) {
            return <Loading />;
        }
        
        return (
            <div className="app">
                {this.props.children}
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    let route = ownProps.routes[ownProps.routes.length - 1];
    return {
        connected: state.connection.connected,
        connecting: state.connection.connecting,
        username: state.user.username,
        isLogin: route.path === 'login'
    };
};

const mapDispatchToProps = (dispatch) => ({
    connect: () => {
        dispatch(socketConnect());
    },
    loginRedirect: () => {
        dispatch(push(`/login?redirect=${window.location.pathname}`));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(App);