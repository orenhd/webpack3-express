import mongoose from 'mongoose';
import express from 'express';
import socketIO from 'socket.io';

import bodyParser from 'body-parser';

import config from './config';
;
import router from './routes/router';

import * as socketBindings from './socket-bindings';

//init mongodb connection
mongoose.connection.on("open", function (ref) {
  console.log("Connected to mongo server.");
});

mongoose.connection.on("error", function (err) {
  console.log("Could not connect to mongo server!", err);
});

mongoose.connect(config.databases.mongodb.uri, { useMongoClient: true });

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

// configure error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: err });
})

// configure 404 handler
app.use((req, res, next) => {
  res.status(404).send('Sorry, not found.')
})

//start server + socket
const server = app.listen(config.app.port, () => {
  console.log(`Magic happens on port ${config.app.port}, on environment '${config.env}'.`);
});
const io = socketIO.listen(server);

// init. socket bindings
socketBindings.bind(io);




