import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import { Route } from 'react-router';
import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux';

import * as reducers from './reducers';
import LoginPage from './components/login-page';

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
            <Route path="/login" component={LoginPage} />
        </ConnectedRouter>
    </Provider>,
    document.getElementById('mount')
);