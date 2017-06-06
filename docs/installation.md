# Installation

# Prerequisites

* Node.js >= 7.9.0
* NPM >= 4.2.0
* RethinkDB >= 2.3.0

# Building the Client

    cp config/client.example.json config/client.json
    vim config/client.json # Edit config as necessary
    cd client
    npm install
    npm run build

# Building the Server

    cp config/socket-server.example.json config/socket-server.json
    vim config/socket-server.json # Edit config as necessary
    cd socket-server
    npm install
    scripts/db configure
    scripts/db create default
    npm run build
    npm run serve