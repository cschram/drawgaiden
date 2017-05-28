import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'

import * as reducers from './reducers';
import App from './components/app';
import IndexPage from './components/index-page';
import LoginPage from './components/login-page';
import CanvasPage from './components/canvas-page';
import NotFoundPage from './components/not-found-page';

import "./style/main.scss";

const store = createStore(
    combineReducers({
        ...reducers,
        routing: routerReducer
    }),
    applyMiddleware(thunk)
);

const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" component={App}>
                <IndexRoute component={IndexPage} />
                <Route path="login" component={LoginPage} />
                <Route path="canvas/:id" component={CanvasPage} />
                <Route component={NotFoundPage} />
            </Route>
        </Router>
    </Provider>,
    document.getElementById('mount')
);