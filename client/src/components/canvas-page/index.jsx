import React from 'react';
import EaselWrap from '../easel-wrap';
import './style.scss';

class CanvasPage extends React.Component {
    render() {
        return (
            <div className="canvas-page">
                <EaselWrap />
            </div>
        );
    }
}

export default CanvasPage;