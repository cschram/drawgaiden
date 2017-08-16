import React from 'react';
import renderer from 'react-test-renderer';
import { NotFoundPage } from './index';
import testData from '../../__testdata__/canvas';

test('<App/>', () => {
    const tree = renderer.create(<NotFoundPage />).toJSON();
    expect(tree).toMatchSnapshot();
});