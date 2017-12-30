import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import Loading from '../loading';
import EaselWrap from '../easel-wrap';
import Icon from '../icon';
import { joinCanvas, draw, setMousePosition } from '../../actions/canvas';
import { Canvas, HistoryEntry, Coord, User } from '@drawgaiden/common';
import SaveModal from './save-modal';
import ShareModal from './share-modal';
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

type Modal = 'none' | 'share' | 'save';

interface ClassPageState {
    modal: Modal;
    modalData: any;
}

export class CanvasPage extends React.Component<ClassPageProps, ClassPageState> {
    constructor(props) {
        super(props);
        this.state = {
            modal: 'none',
            modalData: null
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
        this.setState({
            modal: 'share',
            modalData: null
        });
    };

    private showSaveModal = (data: string) => {
        this.setState({
            modal: 'save',
            modalData: data
        });
    }

    private hideModal = () => {
        this.setState({
            modal: 'none',
            modalData: null
        });
    }

    componentDidMount() {
        this.loadCanvas();
    }
    
    componentDidUpdate() {
        this.loadCanvas();
    }

    renderModal() {
        if (this.state.modal === 'share') {
            return <ShareModal onClose={this.hideModal} />;
        } else if (this.state.modal === 'save') {
            return <SaveModal onClose={this.hideModal} imageData={this.state.modalData as string} />;
        } else {
            return null;
        }
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
                           share={this.showShareModal}
                           save={this.showSaveModal} />
                {this.renderModal()}
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