import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import Icon from '../icon';
import Input from '../input';
import Button from '../button';
import { login } from '../../actions/user';
import "./style.scss";
import logoPath from "../../img/logo_big.png";

interface LoginPageProps {
    loggingIn: boolean;
    loginError: string;
    login: (username: string, redirect: string) => void;
    redirect?: string;
}

interface LoginPageState {
    username: string;
}

export class LoginPage extends React.Component<LoginPageProps, LoginPageState> {
    constructor(props) {
        super(props);
        this.state = {
            username: ''
        };
    }

    onChangeUsername = (username: string) => {
        this.setState({ username });
    };

    login = () => {
        if (!this.props.loggingIn) {
            this.props.login(this.state.username, this.props.redirect || '');
        }
    };

    render() {
        return (
            <div className="login-page">
                <form className="login-form" onSubmit={this.login}>
                    <img src={logoPath} alt="Draw Gaiden" />
                    <fieldset>
                        {this.props.loginError ?
                            <span className="error">{this.props.loginError}</span> :
                            null
                        }
                        <Input name="username"
                               value={this.state.username}
                               onChange={this.onChangeUsername}
                               placeholder="Enter user name" />
                        <Button onClick={this.login}>
                            {this.props.loggingIn ?
                                <Icon name="loading" /> :
                                <span>Login</span>}
                        </Button>
                        <p>Having issues? Check our <a href="https://github.com/drawgaiden/drawgaiden/issues" target="_blank">bug tracker</a>.</p>
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