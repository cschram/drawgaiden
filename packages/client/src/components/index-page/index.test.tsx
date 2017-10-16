import React from 'react';
import renderer from 'react-test-renderer';
import { IndexPage } from './index';
import testData from '../../__testdata__/canvas';

test('<App/>', () => {
    const props = {
        lastCanvasID: '',
        createCanvas: () => {},
        joinCanvas: (id: string) => {}
    };
    const tree = renderer.create(<IndexPage {...props}/>).toJSON();
    expect(tree).toMatchSnapshot();
});