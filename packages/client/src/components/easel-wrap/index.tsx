import React from 'react';
import ReactDOM from 'react-dom';
import throttle from 'lodash.throttle';
import shallowCompare from 'react-addons-shallow-compare';
import Icon from '../icon';
import Loading from '../loading';
import Easel from '@drawgaiden/easel';
import { Coord } from '@drawgaiden/easel/lib/util';
import { Canvas, HistoryEntry, User } from '@drawgaiden/common';
import '@drawgaiden/easel/lib/style.css';
import './style.scss';

interface EaselWrapProps {
    canvas: Canvas;
    history: HistoryEntry[];
    latestEntry: HistoryEntry;
    users: User[];
    username: string;
    draw: (entry: HistoryEntry) => void;
    setMousePosition: (coord: Coord) => void;
    share: () => void;
    save: (data: string) => void;
}

interface QueueItem {
    entry: HistoryEntry;
    ignoreOwn: boolean;
}

class EaselWrap extends React.Component<EaselWrapProps> {
    easel: Easel;
    queue: QueueItem[];

    /**
     * Drain queue of history entries, calling easel.draw for each one.
     * A queue is used to request an animation frame for each entry in order
     * to prevent locking up the UI thread.
     */
    private drainQueue() {
        if (this.queue.length > 0 && this.easel) {
            let { entry, ignoreOwn } = this.queue.shift();
            requestAnimationFrame(() => {
                if (!ignoreOwn || entry.username !== this.props.username) {
                    this.easel.draw(entry.toolName, entry.path, entry.settings);
                }
                this.drainQueue();
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

    private onSave = (e) => {
        e.preventDefault();
        this.props.save(this.easel.toDataURL());
    };

    private onShare = (e) => {
        e.preventDefault();
        this.props.share();
    };

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.latestEntry !== this.props.latestEntry) {
            this.queue = this.queue.concat([{
                entry: nextProps.latestEntry,
                ignoreOwn: true
            }]);
            this.drainQueue();
        }
        return shallowCompare(this, nextProps, nextState);
    }

    componentDidMount() {
        const startQueue = () => {
            this.queue = this.props.history.map(entry => ({
                entry,
                ignoreOwn: false
            }));
            this.drainQueue();
        };
        let container = ReactDOM.findDOMNode(this.refs['container']) as HTMLElement;
        if (container) {
            this.easel = new Easel(container, {
                width: this.props.canvas.width,
                height: this.props.canvas.height,
                backgroundColor: this.props.canvas.backgroundColor,
                layers: this.props.canvas.layers,
                onMouseMove: throttle(this.props.setMousePosition, 33),
                onDraw: this.onDraw
            });
            if (this.props.canvas.snapshots && this.props.canvas.snapshots.length > 0) {
                let promises = this.props.canvas.snapshots.map((snapshot, i) => {
                    return new Promise((resolve, reject) => {
                        const img = new Image();
                        img.onload = () => {
                            this.easel.drawImage(img, { x: 0, y: 0 }, i);
                            resolve();
                        };
                        img.onerror = () => {
                            reject();
                        };
                        img.src = snapshot;
                    });
                });
                Promise.all(promises).then(() => {
                    startQueue();
                });
            } else {
                startQueue();
            }
        }
    }

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
                <div className="easel__settings">
                    <div className="easel__option-colors">
                        <input type="color" name="stroke-color" defaultValue="#000000" />
                        <a href="#" className="easel__color-switch">↔</a>
                        <input type="color" name="fill-color" defaultValue="#ffffff" />
                    </div>
                    <div className="easel__option-layer">
                        <span>Layer:</span>
                        <select name="layer"></select>
                    </div>
                    <div className="easel__option-size">
                        <span>Size:</span>
                        <input type="range" name="size" min="1" max="40" defaultValue="1" />
                    </div>
                    <div className="easel__option-opacity">
                        <span>Opacity:</span>
                        <input type="range" name="opacity" min="0" max="100" defaultValue="100" />
                    </div>
                    <div className="easel__option-smoothness">
                        <span>Smoothness:</span>
                        <input type="range" name="smoothness" min="0" max="100" defaultValue="80" />
                    </div>
                    <button className="easel__save" onClick={this.onSave}>
                        Save
                    </button>
                    <button className="easel__share" onClick={this.onShare}>
                        Share
                    </button>
                </div>
                <div className="easel__main">
                    <ul className="easel__tools">
                        <li className="easel__tool">
                            <input type="radio" name="tool" id="easel_tool_pencil" defaultValue="pencil" defaultChecked={true} />
                            <label htmlFor="easel_tool_pencil">
                                <i className="fa fa-pencil" aria-hidden="true"></i>
                            </label>
                        </li>
                        <li className="easel__tool">
                            <input type="radio" name="tool" id="easel_tool_rectangle" defaultValue="rectangle" />
                            <label htmlFor="easel_tool_rectangle">
                                <i className="fa fa-square-o" aria-hidden="true"></i>
                            </label>
                        </li>
                        <li className="easel__tool">
                            <input type="radio" name="tool" id="easel_tool_circle" defaultValue="circle" />
                            <label htmlFor="easel_tool_circle">
                                <i className="fa fa-circle-o" aria-hidden="true"></i>
                            </label>
                        </li>
                        <li className="easel__tool">
                            <input type="radio" name="tool" id="easel_tool_eraser" defaultValue="eraser" />
                            <label htmlFor="easel_tool_eraser">
                                <i className="fa fa-eraser" aria-hidden="true"></i>
                            </label>
                        </li>
                        <li className="easel__tool">
                            <input type="radio" name="tool" id="easel_tool_move" defaultValue="move" />
                            <label htmlFor="easel_tool_move">
                                <i className="fa fa-arrows-alt" aria-hidden="true"></i>
                            </label>
                        </li>
                        <li className="easel__tool">
                            <input type="radio" name="tool" id="easel_tool_colorpicker" defaultValue="colorpicker" />
                            <label htmlFor="easel_tool_colorpicker">
                                <i className="fa fa-eyedropper" aria-hidden="true"></i>
                            </label>
                        </li>
                    </ul>
                    <div className="easel__canvas">
                        <div className="easel__canvas-layers"></div>
                        <div className="easel__overlay">
                            {this.props.users.map(this.renderUsers)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default EaselWrap;