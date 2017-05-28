import React from 'react';
import { connect } from 'react-redux';
import EaselWrap from '../easel-wrap';
import './style.scss';

function CanvasPage() {
    return (
        <div className="canvas-page">
            <EaselWrap />
        </div>
    );
}

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(CanvasPage);