# Installation

# Prerequisites

* Node.js >= 7.9.0
* NPM >= 4.2.0
* RethinkDB >= 2.3.0

Draw Gaiden has been tested with the above versions, but older versions may work.

# Building the Client

    cp config/client.example.json config/client.json
    vim config/client.json # Edit config as necessary
    cd client
    npm install
    npm run build

Compiled client code should be output to the `client/dist` directory, which can then be copied to a location on your machine where a webserver is serving from.
The client server needs to be setup to support a single page app and proxy API connections. An example nginx conf can be found in the `config` directory.

# Building the Server

    cp config/server.example.json config/server.json
    vim config/server.json # Edit config as necessary
    cd server
    npm install
    scripts/db configure
    scripts/db create default
    npm run build

You can run `npm run serve` to run the server, or if you're using [PM2](https://github.com/Unitech/pm2) you can run it with `pm2 start ecosystem.config.json`.