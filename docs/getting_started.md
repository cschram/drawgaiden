# Getting Started

## Prerequisites

* [Node.js](https://nodejs.org/) >= 6.11
* [NPM](https://www.npmjs.com/) >= 3.10
* [RethinkDB](https://rethinkdb.com/) >= 2.3

Draw Gaiden has been tested with the above versions, but older versions may work.

## Configuration

There are two default configuration files for the server, located in `packages/server/config` named `dev.config.json` for development and `prod.config.json` for production. You can use these or copy and modify these for your environment.

## Building

Before anything else you need to install dependencies with `npm install`. 
If you're looking to contribute and work on Draw Gaiden you can run the app in development mode with `npm start`.
Otherwise you can build the app with `npm run build`.

## Running

Before running the server for the first time the database needs to be initialized. You can run the script `scripts/db init` to do this for you.

### Development

In development all you need to run is `npm start`.

## Production

You need a web server to serve the static client files as a single page web app (any URI that does not match a file gets routed to index.html). There's an example nginx conf in `nginx.example.conf`.

If you have [PM2](http://pm2.keymetrics.io/) installed you can use `packages/server/ecosystem.config.json` to start up the backend services.
Otherwise you'll need to run `packages/server/dist/server/socket/index.js` and `packages/server/dist/server/janitor/index.js` with Node.

The example production setup expects to run four instances of the socket server, load balanced behind a separate host (api.drawgaiden.com in the example files).