import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createCanvas } from '../../actions/canvas';
import Loading from '../loading';

interface IndexPageProps {
    createCanvas: () => void;
}

class IndexPage extends React.Component<IndexPageProps, void> {
    componentDidMount() {
        this.props.createCanvas();
    }
    
    render() {
        return (
            <div className="index-page">
                <Loading />
            </div>
        );
    }
}

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
    createCanvas: () => {
        dispatch(createCanvas());
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(IndexPage);