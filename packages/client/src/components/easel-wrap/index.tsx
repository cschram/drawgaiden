import React from 'react';
import ReactDOM from 'react-dom';
import throttle from 'lodash.throttle';
import Icon from '../icon';
import Loading from '../loading';
import Easel from '../../easel';
import { Coord } from '../../easel/util';
import { Canvas, HistoryEntry, User } from '../../../../common/canvas';
import "./style.scss";

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
        id: 'move',
        icon: 'arrows-alt',
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
    users: User[];
    username: string;
    draw: (entry: HistoryEntry) => void;
    setMousePosition: (coord: Coord) => void;
}

class EaselWrap extends React.Component<EaselWrapProps, void> {
    easel: Easel;
    queue: HistoryEntry[];

    private drainQueue(ignoreOwn = false) {
        if (this.queue.length > 0) {
            let entry = this.queue.shift();
            requestAnimationFrame(() => {
                if (!ignoreOwn || entry.username !== this.props.username) {
                    this.easel.draw(entry.toolName, entry.path, entry.settings);
                }
                this.drainQueue(ignoreOwn);
            });
        }
    }

    private onDraw = (path: Coord[]) => {
        let entry: HistoryEntry = {
            canvasID: this.props.canvas.id,
            username: this.props.username,
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
        const startQueue = () => {
            this.queue = this.props.history;
            this.drainQueue();
        };
        let container = ReactDOM.findDOMNode(this.refs['container']) as HTMLElement;
        this.easel = new Easel(container, {
            width: this.props.canvas.width,
            height: this.props.canvas.height,
            backgroundColor: this.props.canvas.backgroundColor,
            onMouseMove: throttle(this.props.setMousePosition, 33),
            onDraw: this.onDraw
        });
        if (this.props.canvas.snapshot) {
            const img = new Image();
            img.onload = () => {
                this.easel.drawImage(img, { x: 0, y: 0 });
                startQueue();
            };
            img.src = this.props.canvas.snapshot;
        } else {
            startQueue();
        }
    }

    renderTool = (tool, index) => {
        return (
            <li key={index} className="easel__tool">
                <input type="radio" name="tool" id={`easel_tool_${tool.id}`} value={tool.id} defaultChecked={tool.default} />
                <label htmlFor={`easel_tool_${tool.id}`}>
                    <Icon name={tool.icon} />
                </label>
            </li>
        );
    };

    renderUsers = (user: User, index) => {
        const style = {
            left: user.mousePosition.x,
            top: user.mousePosition.y
        };
        return (
            <span key={index} className="easel-wrap__user" style={style}>{user.username}</span>
        );
    };

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
                        <input type="range" name="size" min="1" max="40" defaultValue="1" />
                    </div>
                    <button className="easel__save">
                        Save
                    </button>
                </div>
                <div className="easel__canvas">
                    <canvas className="easel__canvas-final"></canvas>
                    <canvas className="easel__canvas-draft"></canvas>
                    <div className="easel__overlay">
                        {this.props.users.map(this.renderUsers)}
                    </div>
                </div>
            </div>
        );
    }
}

export default EaselWrap;