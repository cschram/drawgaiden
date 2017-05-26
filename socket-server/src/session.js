'use strict';

//
// JWT Session Manager
//
// Manages session state, parsing and generating JWT tokens,
// and ensuring state is sane.
//

const jwt = require('jsonwebtoken');

const DEFAULT_STATE = {
    authed: false
};

const SIGN_OPTIONS = {
    expiresIn: '7 days'
};

class SessionError extends Error {
    constructor(message) {
        super(message);
        this.message = 'Session Error: ' + message;
        this.name = this.constructor.name;
        this.stack = (new Error).stack;
    }
}

class Session {
    constructor(secret, state) {
        this._secret = secret;
        this._state = Object.assign({}, DEFAULT_STATE, state);
    }

    // Ensures state is sane.
    _invariant(state) {
        if (state.authed && !state.username) {
            throw new SessionError('"username" must be set when authed.');
        }
    }

    // Parse an existing token and set payload as current state.
    parse(token) {
        try {
            let payload = jwt.verify(token, this._secret);
            let newState = Object.assign({}, DEFAULT_STATE, payload);
            this._invariant(newState);
            this._state = newState;
            return true;
        } catch (e) {
            return false;
        }
    }

    // Get JWT token for current state.
    getToken() {
        return jwt.sign(this._state, this._secret, SIGN_OPTIONS);
    }

    // Get state value.
    get(key) {
        return this._state[key];
    }

    // Set state value.
    // Returns new JWT token.
    set(key, val) {
        let newState = {};
        if (typeof key === 'object') {
            newState = Object.assign({}, this._state, key);
        } else {
            newState[key] = val;
        }
        this._invariant(newState);
        this._state = newState;
        return this.getToken();
    }

    // Clear all state to default
    clear() {
        this._state = DEFAULT_STATE;
        return this.getToken();
    }

    // Returns true is state is current authenticated.
    isAuthed() {
        return this._state.authed;
    }
}

module.exports = Session;