import React from 'react';
import ReactDOM from 'react-dom';

import CircleTool from '../tools/circle';
import ColorPickerTool from '../tools/colorpicker';
import EraserTool from '../tools/eraser';
import PencilTool from '../tools/pencil';
import RectangleTool from '../tools/rectangle';

class CanvasArea extends React.Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        let propsDiff = Object.keys(nextProps).some(key => {
            if (key !== 'history') {
                return nextProps[key] !== this.props[key];
            }
            return false;
        });

        if (propsDiff) {
            return true;
        }

        return Object.keys(nextState).some(key => {
            return nextState[key] !== this.state[key];
        });
    }

    componentDidMount() {
        let canvasFinal = ReactDOM.findDOMNode(this.refs['canvas-final']);
        let canvasDraft = ReactDOM.findDOMNode(this.refs['canvas-draft']);
        this.finalCtx = canvasFinal.getContext('2d');
        this.draftCtx = canvasFinal.getContext('2d');
        this.tools = {
            circle: new CircleTool(this.finalCtx, this.draftCtx),
            colorpicker: new ColorPickerTool(this.finalCtx, this.draftCtx),
            eraser: new EraserTool(this.finalCtx, this.draftCtx),
            pencil: new PencilTool(this.finalCtx, this.draftCtx),
            rectangle: new RectangleTool(this.finalCtx, this.draftCtx)
        };

        let container = ReactDOM.findDOMNode(this.refs['container']);

        container.addEventListener('mousemove', (e) => {

        });
    }

    clear() {
        this.finalCtx.clearRect(0, 0, this.finalCtx.canvas.width, this.finalCtx.canvas.height);
        this.draftCtx.clearRect(0, 0, this.draftCtx.canvas.width, this.draftCtx.canvas.height);
    }

    render() {
        return (
            <div className="canvas-area" ref="container">
                <canvas ref="canvas-final" width={this.props.width} height={this.props.height}></canvas>
                <canvas ref="canvas-draft" width={this.props.width} height={this.props.height}></canvas>
            </div>
        );
    }
}