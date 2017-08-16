import React from 'react';
import renderer from 'react-test-renderer';
import { App } from './index';

test('<App/>', () => {
    const props = {
        connected: true,
        connecting: false,
        connect: () => {},
        username: 'username',
        loginRedirect: () => {},
        isLogin: false
    };
    const tree = renderer.create(<App {...props}/>).toJSON();
    expect(tree).toMatchSnapshot();
});