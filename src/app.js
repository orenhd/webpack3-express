import mongoose from 'mongoose';
import express from 'express';
import socketIO from 'socket.io';

import bodyParser from 'body-parser';

import config from './config';
;
import router from './routes/router';

import * as socketBindings from './socket-bindings';

//init mongodb connection
mongoose.connection.on("open", function(ref) {
  console.log("Connected to mongo server.");
});

mongoose.connection.on("error", function(err) {
  console.log("Could not connect to mongo server!", err);
});

mongoose.connect(config.mongodb.uri, { useMongoClient: true });

const app = express();

// configure app to use bodyParser()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//define public directory
app.use("/", express.static(__dirname + '/public'));

// define served pages
app.get('/paint-socket', function (req, res) {
  res.sendFile(__dirname + '/public/paint-socket.html');
});

// all of our routes will be prefixed with /api
app.use('/api', router);

//start server + socket
const io = socketIO.listen(app.listen(config.app.port));

// init. socket bindings
socketBindings.bind(io);

console.log(`Magic happens on port ${config.app.port}`)


