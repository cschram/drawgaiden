import React from 'react';
import { connect } from 'react-redux';

function App({ children }) {
    return (
        <div className="app">
            {children}
        </div>
    );
}

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(App);