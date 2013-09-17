var express = require("express"),
    app     = express(),
    server  = require("http").createServer(app),
    io      = require("socket.io").listen(server),
    path    = require("path"),
    config  = require("./config");

app.configure(function () {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'hjs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function () {
  app.use(express.errorHandler());
});

app.get('/', function (req, res) {
  res.render('index', config);
});

server.listen(app.get('port'), function () {
  console.log("Express server listening on port " + app.get('port'));
});

io.sockets.on("connection", function (sock) {
    console.log("Socket.io Connection.");
});