import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import Icon from '../icon';
import { login } from '../../actions/user';
import "./style.scss";
import logoPath from "../../img/logo_big.png";

interface LoginPageProps {
    loggingIn: boolean;
    loginError: string;
    login: (username: string, redirect: string) => void;
    redirect?: string;
}

class LoginPage extends React.Component<LoginPageProps, void> {
    private loginHandler: (e) => void;

    constructor(props) {
        super(props);
        this.loginHandler = this.login.bind(this);
    }

    login(e) {
        e.preventDefault();
        if (!this.props.loggingIn) {
            let usernameInput = ReactDOM.findDOMNode(this.refs['username']) as HTMLInputElement;
            this.props.login(usernameInput.value, this.props.redirect || '');
        }
    }

    render() {
        return (
            <div className="login-page">
                <form className="login-form" onSubmit={this.loginHandler}>
                    <img src={logoPath} />
                    <fieldset>
                        {this.props.loginError ?
                            <span className="error">{this.props.loginError}</span> :
                            null
                        }
                        <input type="text" ref="username" placeholder="Enter user name" />
                        <button onClick={this.loginHandler}>
                            {this.props.loggingIn ?
                                <Icon name="loading" /> :
                                <span>Login</span>}
                        </button>
                    </fieldset>
                </form>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    loggingIn: state.user.loggingIn,
    loginError: state.user.loginError,
    redirect: ownProps.location.query.redirect
});

const mapDispatchToProps = (dispatch) => ({
    login: (username: string, redirect: string) => {
        dispatch(login(username, redirect));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);