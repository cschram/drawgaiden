# Installation

## Prerequisites

* [Node.js](https://nodejs.org/) >= 6.11
* [NPM](https://www.npmjs.com/) >= 3.10
* [RethinkDB](https://rethinkdb.com/) >= 2.3

Draw Gaiden has been tested with the above versions, but older versions may work.

## Configuration

There are two necessary configuration files for the client and server, you can copy the example files:

    cp config/client.dev.json config/client.json
    cp config/server.dev.json config/server.json

You can use `client.prod.json` and `server.prod.json` and edit any necessary values for a production deployment.

## Building

Before anything else you need to install dependencies with `npm install`. 
If you're looking to contribute and work on Draw Gaiden you can run the app in development mode with `npm start`.
Otherwise you can build the app with `npm run build`.

## Running

You need a web server to serve the static client files as a single page web app (any URI that does not match a file gets routed to index.html). There's an example nginx conf at `config/nginx.example.conf`.

Before running the server for the first time the database needs to be initialized. You can run the script `scripts/db init` to do this for you.
If you have [PM2](http://pm2.keymetrics.io/) installed you can use `packages/server/ecosystem.config.json` to start up the backend services.
Otherwise you'll need to run `packages/server/dist/server/src/socket/index.js` and `packages/server/dist/server/src/janitor/index.js` with Node.

The example production setup with `client.prod.json`, `server.prod.json`, `nginx.example.conf`, and `ecosystem.config.json` expects to run four instances of the socket server, load balanced behind a separate host (api.drawgaiden.com in the example files).