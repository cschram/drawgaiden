import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createCanvas } from '../../actions/canvas';
import Loading from '../loading';
import Button from '../button';
import './style.scss';

import logoPath from "../../img/logo_big.png";

interface IndexPageProps {
    lastCanvasID: string;
    createCanvas: () => void;
    joinCanvas: (id: string) => void;
}

interface IndexPageState {
    creatingCanvas: boolean;
}

export class IndexPage extends React.Component<IndexPageProps, IndexPageState> {
    constructor(props) {
        super(props);
        this.state = {
            creatingCanvas: false
        };
    }

    createCanvas = () => {
        this.setState({
            creatingCanvas: true
        });
        this.props.createCanvas();
    };

    rejoinCanvas = () => {
        if (this.props.lastCanvasID) {
            this.props.joinCanvas(this.props.lastCanvasID);
        }
    };

    render() {
        return (
            <div className="index-page">
                <div className="index-page__main">
                    <img src={logoPath} alt="Draw Gaiden" />
                    <p>Create or rejoin a canvas to start drawing, and share the link with friends to collaborate.</p>
                    <div>
                        <Button primary={true} onClick={this.createCanvas}>
                            {this.state.creatingCanvas ? <Loading /> : <span>Create Canvas</span>}
                        </Button>
                        <Button onClick={this.rejoinCanvas} disabled={!this.props.lastCanvasID}>
                            Rejoin Canvas
                        </Button>
                    </div>
                    <p>Having issues? Check our <a href="https://github.com/drawgaiden/drawgaiden/issues" target="_blank">bug tracker</a>.</p>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    lastCanvasID: state.canvas.lastCanvasID
});

const mapDispatchToProps = (dispatch) => ({
    createCanvas: () => {
        dispatch(createCanvas());
    },
    joinCanvas: (id: string) => {
        dispatch(push(`/canvas/${id}`));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(IndexPage);