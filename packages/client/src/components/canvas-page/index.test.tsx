import React from 'react';
import renderer from 'react-test-renderer';
import { CanvasPage } from './index';
import testData from '../../../test/data/canvas';

test('<App/>', () => {
    const props = {
        canvasID: testData.canvas.id,
        canvas: testData.canvas,
        history: testData.history,
        latestEntry: testData.newEntry,
        users: testData.users,
        loading: false,
        username: 'username',
        joinCanvas: (id) => {},
        draw: (entry) => {},
        setMousePosition: (coord) => {}
    };
    const tree = renderer.create(<CanvasPage {...props}/>).toJSON();
    expect(tree).toMatchSnapshot();
});