import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { connect as socketConnect } from '../actions/connection';
import Loading from '../components/loading';

function authRequired(component: React.ComponentClass | React.StatelessComponent): React.ComponentClass {
    interface AuthRequiredProps {
        username: string;
        ownProps: any;
        redirect: () => void;
    }
    class AuthRequired extends React.Component<AuthRequiredProps> {
        private checkLogin() {
            if (!this.props.username) {
                this.props.redirect();
            }
        }
        componentDidMount() {
            this.checkLogin();
        }
        componentDidUpdate() {
            this.checkLogin();
        }
        render() {
            if (!this.props.username) {
                return <Loading />;
            }
            return React.createElement(component, this.props.ownProps);
        }
    }
    const mapStateToProps = (state, ownProps) => ({
        username: state.user.username,
        ownProps
    });
    const mapDispatchToProps = (dispatch, ownProps) => ({
        redirect: () => {
            dispatch(push(`/login?redirect=${window.location.pathname}`));
        }
    });
    return connect(mapStateToProps, mapDispatchToProps)(AuthRequired);
}

export default authRequired;