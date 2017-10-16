import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import Loading from '../loading';
import EaselWrap from '../easel-wrap';
import Icon from '../icon';
import { joinCanvas, draw, setMousePosition } from '../../actions/canvas';
import { Canvas, HistoryEntry, Coord, User } from 'drawgaiden-common';
import './style.scss';

interface ClassPageProps {
    canvasID: string;
    canvas: Canvas;
    history: HistoryEntry[];
    latestEntry: HistoryEntry;
    users: User[];
    loading: boolean;
    username: string;
    joinCanvas: (id: string) => void;
    draw: (entry: HistoryEntry) => void;
    setMousePosition: (coord: Coord) => void;
}

interface ClassPageState {
    shareModalOpen: boolean;
}

export class CanvasPage extends React.Component<ClassPageProps, ClassPageState> {
    constructor(props) {
        super(props);
        this.state = {
            shareModalOpen: false
        };
    }

    private loadCanvas() {
        if (!this.props.loading &&
            (this.props.canvas == null || this.props.canvas.id !== this.props.canvasID)
        ) {
            this.props.joinCanvas(this.props.canvasID);
        }
    }

    private showShareModal = () => {
        this.setState({ shareModalOpen: true });
    };

    private hideShareModal = () => {
        this.setState({ shareModalOpen: false });
    }

    private onClickShareLink = () => {
        const input = ReactDOM.findDOMNode(this.refs['share-link']) as HTMLInputElement;
        input.setSelectionRange(0, input.value.length);
    };

    componentDidMount() {
        this.loadCanvas();
    }
    
    componentDidUpdate() {
        this.loadCanvas();
    }

    renderShareModal() {
        return (
            <div className="share-modal">
                <div className="share-modal__content">
                    <a href="#" className="share-modal__close" onClick={this.hideShareModal}>
                        <Icon name="times" />
                    </a>
                    <span>Share this link with your friends to draw with them.</span>
                    <input ref="share-link"
                        type="text"
                        name="share-link"
                        defaultValue={location.href}
                        onClick={this.onClickShareLink} />
                </div>
            </div>
        );
    }
    
    render() {
        if (this.props.canvas == null || this.props.canvas.id !== this.props.canvasID) {
            return <Loading />;
        }

        return (
            <div className="canvas-page">
                <EaselWrap canvas={this.props.canvas}
                           history={this.props.history}
                           latestEntry={this.props.latestEntry}
                           users={this.props.users}
                           username={this.props.username}
                           draw={this.props.draw}
                           setMousePosition={this.props.setMousePosition}
                           share={this.showShareModal} />
                {this.state.shareModalOpen ? this.renderShareModal() : null}
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
    username: state.user.username
});

const mapDispatchToProps = (dispatch) => ({
    joinCanvas: (id: string) => {
        dispatch(joinCanvas(id));
    },
    draw: (entry: HistoryEntry) => {
        dispatch(draw(entry));
    },
    setMousePosition: (coord: Coord) => {
        dispatch(setMousePosition(coord));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(CanvasPage);