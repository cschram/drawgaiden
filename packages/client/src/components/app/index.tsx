import React from 'react';
import { connect } from 'react-redux';
import { connect as socketConnect } from '../../actions/connection';
import Loading from '../loading';
import './style.scss';

interface AppProps {
    connected: boolean;
    connecting: boolean;
    connect: () => void;
}

export class App extends React.Component<AppProps> {
    private checkConnection() {
        if (!this.props.connected && !this.props.connecting) {
            this.props.connect();
        }
    }

    componentDidMount() {
        this.checkConnection();
    }

    componentDidUpdate() {
        this.checkConnection();
    }

    render() {
        if (!this.props.connected) {
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
        connecting: state.connection.connecting
    };
};

const mapDispatchToProps = (dispatch) => ({
    connect: () => {
        dispatch(socketConnect());
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(App);