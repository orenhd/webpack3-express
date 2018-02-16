import express from 'express';
import socketIO from 'socket.io';

import bodyParser from 'body-parser';

import router from './routes/router';

const app = express();

// configure app to use bodyParser()
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 8080; // set our port

//define public directory
app.use("/", express.static(__dirname + '/public'));

// define served pages
app.get('/paint-socket', function (req, res) {
  res.sendFile(__dirname + '/public/paint-socket.html');
});

// all of our routes will be prefixed with /api
app.use('/api', router);

const io = socketIO.listen(app.listen(port)); //start server + socket

console.log('Magic happens on port ' + port);

io.on('connection', (socket) => {
  socket.on('submit', (doodleData) => {
    io.emit('publish', doodleData);
  });
});
