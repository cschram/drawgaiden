import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

interface IndexPageProps {
    goToCanvas: (id: string) => void;
}

class IndexPage extends React.Component<IndexPageProps, void> {
    componentDidMount() {
        this.props.goToCanvas('default');
    }
    
    render() {
        return (
            <div className="index-page">

            </div>
        );
    }
}

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
    goToCanvas: (id: string) => {
        dispatch(push(`/canvas/${id}`));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(IndexPage);