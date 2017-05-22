import React from 'react';
import ReactDOM from 'react-dom';
import Icon from '../icon';
import Easel from '../../easel';

const tools = [
    {
        id: 'pencil',
        icon: 'pencil',
        default: true
    },
    {
        id: 'rectangle',
        icon: 'square-o',
        default: false
    },
    {
        id: 'circle',
        icon: 'circle-o',
        default: false
    },
    {
        id: 'eraser',
        icon: 'eraser',
        default: false
    },
    {
        id: 'colorpicker',
        icon: 'eyedropper',
        default: false
    }
];

// Props that should not trigger a re-render
const staticProps = [ 'history' ];

class CanvasPage extends React.Component {
    shouldComponentUpdate(nextProps, nextState) {
        let propsDiff = Object.keys(nextProps).some(key => {
            if (staticProps.indexOf(key) === -1) {
                return nextProps[key] !== this.props[key];
            }
            return false;
        });

        if (propsDiff) {
            return true;
        }

        // State is undefined for now because no state is being used
        // return Object.keys(nextState).some(key => {
        //     return nextState[key] !== this.state[key];
        // });

        return false;
    }

    componentDidMount() {
        let container = ReactDOM.findDOMNode(this.refs['container']);
        this.easel = new Easel(container);
    }

    renderTool(tool, index) {
        return (
            <li key={index} className="easel__tool">
                <input type="radio" name="tool" id={`easel_tool_${tool.id}`} value={tool.id} defaultChecked={tool.default} />
                <label htmlFor={`easel_tool_${tool.id}`}>
                    <Icon name={tool.icon} />
                </label>
            </li>
        );
    }

    render() {
        return (
            <div className="easel" ref="container">
                <div className="easel__toolbar">
                    <ul className="easel__tools">
                        {tools.map(this.renderTool)}
                    </ul>
                    <div className="easel__tool-colors">
                        <input type="color" name="stroke-color" defaultValue="#000000" />
                        <a href="#" name="color-switch">↔</a>
                        <input type="color" name="fill-color" defaultValue="#ffffff" />
                    </div>
                    <div className="easel__tool-size">
                        <input type="range" name="size" min="1" max="25" defaultValue="1" />
                    </div>
                </div>
                <div className="easel__canvas">
                    <canvas className="easel__canvas-final"></canvas>
                    <canvas className="easel__canvas-draft"></canvas>
                </div>
            </div>
        );
    }
}

export default CanvasPage;