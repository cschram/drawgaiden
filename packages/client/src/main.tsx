import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, Redirect, browserHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer, routerMiddleware } from 'react-router-redux'

import * as reducers from './reducers';
import App from './components/app';
import IndexPage from './components/index-page';
import LoginPage from './components/login-page';
import CanvasPage from './components/canvas-page';
import NotFoundPage from './components/not-found-page';

import "./style/main.scss";

const composeEnhancers = window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] || compose;
const store = createStore(
    combineReducers({
        ...reducers,
        routing: routerReducer
    }),
    composeEnhancers(applyMiddleware(routerMiddleware(browserHistory), thunk))
);

const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <Route path="/" component={App}>
                <IndexRoute component={IndexPage} />
                <Route path="login" component={LoginPage} />
                <Route path="canvas/:id" component={CanvasPage} />
                <Route path="404" component={NotFoundPage} />
                <Redirect from="*" to="404" />
            </Route>
        </Router>
    </Provider>,
    document.getElementById('mount')
);