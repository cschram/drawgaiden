import React from 'react';
import ReactDOM from 'react-dom';
import Icon from '../icon';
import Loading from '../loading';
import Easel from '../../easel';
import { Coord } from '../../easel/util';
import { Canvas, HistoryEntry } from '../../../../common/canvas';

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

interface EaselWrapProps {
    canvas: Canvas;
    history: HistoryEntry[];
    userName: string;
    draw: (entry: HistoryEntry) => void;
}

class EaselWrap extends React.Component<EaselWrapProps, void> {
    easel: Easel;
    queue: HistoryEntry[];

    private drainQueue(ignoreOwn = false) {
        if (this.queue.length > 0) {
            let entry = this.queue.shift();
            requestAnimationFrame(() => {
                if (!ignoreOwn || entry.userName !== this.props.userName) {
                    this.easel.draw(entry.toolName, entry.path, entry.settings);
                }
                this.drainQueue(ignoreOwn);
            });
        }
    }

    private onDraw = (path: Coord[]) => {
        let entry: HistoryEntry = {
            canvasID: this.props.canvas.id,
            userName: this.props.userName,
            toolName: this.easel.getTool(),
            settings: this.easel.getToolSettings(),
            path
        };
        this.props.draw(entry);
    };

    shouldComponentUpdate(nextProps, nextState) {
        return Object.keys(nextProps).some(key => {
            if (key === 'history') {
                // Handle new history entries
                let newHistory = nextProps.history;
                let oldHistory = this.props.history;
                if (newHistory.length > oldHistory.length) {
                    this.queue = this.queue.concat(newHistory.slice(oldHistory.length - 1));
                    this.drainQueue(true);
                }
                return false;
            } else {
                return nextProps[key] !== this.props[key];
            }
        });
    }

    componentDidMount() {
        let container = ReactDOM.findDOMNode(this.refs['container']) as HTMLElement;
        this.easel = new Easel(container, {
            width: this.props.canvas.width,
            height: this.props.canvas.height,
            backgroundColor: this.props.canvas.backgroundColor,
            onDraw: this.onDraw
        });
        this.queue = this.props.history;
        this.drainQueue();
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

export default EaselWrap;