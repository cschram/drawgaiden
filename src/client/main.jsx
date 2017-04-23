import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import { Route, Redirect } from 'react-router';
import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux';

import * as reducers from './reducers';
import IndexPage from './components/index-page';
import LoginPage from './components/login-page';
import CanvasPage from './components/canvas-page';
import NotFoundPage from './components/not-found-page';

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
            <Route path="/" component={IndexPage} />
            <Route path="/login" component={LoginPage} />
            <Route path="/canvas/:id" component={CanvasPage} />
            <Route path="/404" component={NotFoundPage} />
            <Redirect from="*" to="404" />
        </ConnectedRouter>
    </Provider>,
    document.getElementById('mount')
);