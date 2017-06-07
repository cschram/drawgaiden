import React from 'react';
import { connect } from 'react-redux';
import Loading from '../loading';
import EaselWrap from '../easel-wrap';
import { joinCanvas, draw } from '../../actions/canvas';
import { Canvas, HistoryEntry } from '../../../../defs/canvas';
import './style.scss';

interface ClassPageProps {
    canvasID: string;
    canvas: Canvas;
    history: HistoryEntry[];
    loading: boolean;
    userName: string;
    joinCanvas: (id: string) => void;
    draw: (entry: HistoryEntry) => void;
}

class CanvasPage extends React.Component<ClassPageProps, void> {
    private loadCanvas() {
        if (!this.props.loading &&
            (this.props.canvas == null || this.props.canvas.id !== this.props.canvasID)
        ) {
            this.props.joinCanvas(this.props.canvasID);
        }
    }

    componentDidMount() {
        this.loadCanvas();
    }
    
    componentDidUpdate() {
        this.loadCanvas();
    }
    
    render() {
        if (this.props.canvas == null || this.props.canvas.id !== this.props.canvasID) {
            return <Loading />;
        }

        return (
            <div className="canvas-page">
                <EaselWrap canvas={this.props.canvas}
                           history={this.props.history}
                           userName={this.props.userName}
                           draw={this.props.draw} />
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    canvasID: ownProps.params.id,
    canvas: state.canvas.canvas,
    history: state.canvas.history,
    loading: state.canvas.loading,
    userName: state.user.userName
});

const mapDispatchToProps = (dispatch) => ({
    joinCanvas: (id: string) => {
        dispatch(joinCanvas(id));
    },
    draw: (entry: HistoryEntry) => {
        dispatch(draw(entry));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(CanvasPage);