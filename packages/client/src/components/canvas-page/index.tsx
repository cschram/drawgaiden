import * as React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import shallowCompare from 'react-addons-shallow-compare';
import throttle from 'lodash.throttle';
import { Canvas, HistoryEntry, Coord, User } from '@drawgaiden/common';
import Easel from '@drawgaiden/easel';
import EaselContainer from './easel-container';
import ShareModal from './share-modal';
import Modal from '../modal';
import Icon from '../icon';
import Loading from '../loading';
import {
    joinCanvas,
    leaveCanvas,
    draw,
    setMousePosition,
    changeTool,
    changeLayer,
    changeStrokeColor,
    changeFillColor,
    changeToolSize,
    changeToolOpacity,
    changeToolSmoothness
} from '../../actions/canvas';
import './style.scss';

const tools = [
    { value: 'pencil', label: <Icon name="pencil" /> },
    { value: 'rectangle', label: <Icon name="square-o" /> },
    { value: 'circle', label: <Icon name="circle-o" /> },
    { value: 'eraser', label: <Icon name="eraser" /> },
    { value: 'move', label: <Icon name="arrows-alt" /> },
    { value: 'colorpicker', label: <Icon name="eyedropper" /> }
];

interface QueueItem {
    entry: HistoryEntry;
    ignoreOwn: boolean;
}

interface CanvasPageProps {
    canvasID: string;
    canvas: Canvas;
    history: HistoryEntry[];
    latestEntry: HistoryEntry;
    users: User[];
    loading: boolean;
    username: string;
    joinCanvas: (id: string) => void;
    exit: () => void;
    draw: (entry: HistoryEntry) => void;
    setMousePosition: (coord: Coord) => void;
    currentTool: string;
    changeTool: (tool: string) => void;
    currentLayer: number;
    changeLayer: (layer: number) => void;
    strokeColor: string;
    changeStrokeColor: (color: string) => void;
    fillColor: string;
    changeFillColor: (color: string) => void;
    toolSize: number;
    changeToolSize: (size: number) => void;
    toolOpacity: number;
    changeToolOpacity: (opacity: number) => void;
    toolSmoothness: number;
    changeToolSmoothness: (smoothness: number) => void;
}

interface CanvasPageState {
    hideControls: boolean;
    shareModalOpen: boolean;
}

export class CanvasPage extends React.Component<CanvasPageProps, CanvasPageState> {
    easel: Easel;
    queue: QueueItem[];

    constructor(props) {
        super(props);
        this.state = {
            hideControls: false,
            shareModalOpen: false
        };
    }

    componentDidMount() {
        this.loadCanvas();
    }

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
    
    componentDidUpdate() {
        this.loadCanvas();
        this.updateEasel();
    }

    private loadCanvas() {
        if (!this.props.loading &&
            (this.props.canvas == null || this.props.canvas.id !== this.props.canvasID)
        ) {
            this.props.joinCanvas(this.props.canvasID);
        }
    }

    private initEasel = (container) => {
        if (!this.easel && container) {
            const startQueue = () => {
                this.queue = this.props.history.map(entry => ({
                    entry,
                    ignoreOwn: false
                }));
                this.drainQueue();
            };
            this.easel = new Easel(container, {
                width: this.props.canvas.width,
                height: this.props.canvas.height,
                backgroundColor: this.props.canvas.backgroundColor,
                layers: this.props.canvas.layers,
                onMouseMove: throttle(this.props.setMousePosition, 33),
                onDraw: this.onDraw
            });
            this.updateEasel();
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
    };

    private updateEasel() {
        if (this.easel) {
            this.easel.setTool(this.props.currentTool);
            this.easel.setLayer(this.props.currentLayer);
            this.easel.setStrokeColor(this.props.strokeColor);
            this.easel.setFillColor(this.props.fillColor);
            this.easel.setToolSize(this.props.toolSize);
            this.easel.setToolOpacity(this.props.toolOpacity);
            this.easel.setToolSmoothness(this.props.toolSmoothness);
        }
    }
    
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

    private onToggleControls = () => {
        this.setState({
            hideControls: !this.state.hideControls,
            shareModalOpen: false
        });
    };

    private onShare = () => {
        this.setState({
            hideControls: false,
            shareModalOpen: true
        });
    };

    private onSave = () => {

    };

    private onExit = () => {
        this.props.exit();
    };

    private closeModal = () => {
        this.setState({
            hideControls: false,
            shareModalOpen: false
        });
    };

    render() {
        if (this.props.canvas == null || this.props.canvas.id !== this.props.canvasID) {
            return <Loading />;
        }
        return (
            <div className="canvas-page">
                <EaselContainer
                    innerRef={this.initEasel}
                    hideControls={this.state.hideControls}
                    toggleControls={this.onToggleControls}
                    tools={tools}
                    currentTool={this.props.currentTool}
                    onChangeTool={this.props.changeTool}
                    currentLayer={this.props.currentLayer}
                    numLayers={this.props.canvas.layers}
                    onChangeLayer={this.props.changeLayer}
                    onShare={this.onShare}
                    onSave={this.onSave}
                    onExit={this.onExit}
                    strokeColor={this.props.strokeColor}
                    onChangeStrokeColor={this.props.changeStrokeColor}
                    fillColor={this.props.fillColor}
                    onChangeFillColor={this.props.changeFillColor}
                    toolSize={this.props.toolSize}
                    onChangeToolSize={this.props.changeToolSize}
                    toolOpacity={this.props.toolOpacity}
                    onChangeToolOpacity={this.props.changeToolOpacity}
                    toolSmoothness={this.props.toolSmoothness}
                    onChangeToolSmoothness={this.props.changeToolSmoothness}
                    users={this.props.users} />
                <Modal title={'Share this canvas'}
                       open={this.state.shareModalOpen}
                       height={150}
                       width={300}
                       onClose={this.closeModal}>
                    <ShareModal />
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    canvasID: ownProps.params.id,
    canvas: state.canvas.canvas,
    history: state.canvas.history,
    latestEntry: state.canvas.latestEntry,
    users: state.canvas.users.filter(user => user.username !== state.user.username),
    loading: state.canvas.loading,
    username: state.user.username,
    currentTool: state.canvas.currentTool,
    currentLayer: state.canvas.currentLayer,
    strokeColor: state.canvas.strokeColor,
    fillColor: state.canvas.fillColor,
    toolSize: state.canvas.toolSize,
    toolOpacity: state.canvas.toolOpacity,
    toolSmoothness: state.canvas.toolSmoothness
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    joinCanvas: (id: string) => {
        dispatch(joinCanvas(id));
    },
    exit: () => {
        dispatch(leaveCanvas());
        dispatch(push('/'));
    },
    draw: (entry: HistoryEntry) => {
        dispatch(draw(entry));
    },
    setMousePosition: (coord: Coord) => {
        dispatch(setMousePosition(coord));
    },
    changeTool: (tool: string) => {
        dispatch(changeTool(tool));
    },
    changeLayer: (layer: number) => {
        dispatch(changeLayer(layer));
    },
    changeStrokeColor: (color: string) => {
        dispatch(changeStrokeColor(color));
    },
    changeFillColor: (color: string) => {
        dispatch(changeFillColor(color));
    },
    changeToolSize: (size: number) => {
        dispatch(changeToolSize(size));
    },
    changeToolOpacity: (opacity: number) => {
        dispatch(changeToolOpacity(opacity));
    },
    changeToolSmoothness: (smoothness: number) => {
        dispatch(changeToolSmoothness(smoothness));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(CanvasPage);