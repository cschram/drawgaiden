import React from 'react';
import renderer from 'react-test-renderer';
import { LoginPage } from './index';
import testData from '../../../test/data/canvas';

test('<App/>', () => {
    const props = {
        loggingIn: false,
        loginError: 'Unknown error.',
        login: (username, redirect) => {},
        redirect: '/canvas/12345'
    };
    const tree = renderer.create(<LoginPage {...props}/>).toJSON();
    expect(tree).toMatchSnapshot();
});