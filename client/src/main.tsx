import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import { IndexRoute, Route, Redirect } from 'react-router';
import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux';

import * as reducers from './reducers';
import IndexPage from './components/index-page';
import LoginPage from './components/login-page';
import CanvasPage from './components/canvas-page';
import NotFoundPage from './components/not-found-page';

import "./style/main.scss";

const hist = createHistory();

const store = createStore(
    combineReducers({
        ...reducers,
        routing: routerReducer
    }),
    applyMiddleware(
        thunk,
        routerMiddleware(hist)
    )
);

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={hist}>
            <div>
                <Route path="/" component={IndexPage} />
                <Route path="/login" component={LoginPage} />
                <Route path="/canvas/:id" component={CanvasPage} />
                <Route component={NotFoundPage} />
            </div>
        </ConnectedRouter>
    </Provider>,
    document.getElementById('mount')
);