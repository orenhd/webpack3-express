require("source-map-support").install();
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/build/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("mongoose");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.db = exports.MEADOWS_COLLECTION = undefined;

var _dotenv = __webpack_require__(12);

var _dotenv2 = _interopRequireDefault(_dotenv);

var _mongoose = __webpack_require__(1);

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var config = _dotenv2.default.config();

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.

var MEADOWS_COLLECTION = exports.MEADOWS_COLLECTION = "meadows";

_mongoose2.default.connection.on("open", function (ref) {
  console.log("Connected to mongo server.");
});

_mongoose2.default.connection.on("error", function (err) {
  console.log("Could not connect to mongo server!");
});

_mongoose2.default.connect(process.env.MONGODB_URI || 'mongodb://' + process.env.DB_USER + ':' + process.env.DB_PASS + '@ds149122.mlab.com:49122/cryptic-meadow-db');
var db = exports.db = _mongoose2.default.connection;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _express = __webpack_require__(0);

var _express2 = _interopRequireDefault(_express);

var _socket = __webpack_require__(4);

var _socket2 = _interopRequireDefault(_socket);

var _bodyParser = __webpack_require__(5);

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _router = __webpack_require__(6);

var _router2 = _interopRequireDefault(_router);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

// configure app to use bodyParser()
app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.use(_bodyParser2.default.json());

var port = process.env.PORT || 8080; // set our port

//define public directory
app.use("/", _express2.default.static(__dirname + '/public'));

// define served pages
app.get('/paint-socket', function (req, res) {
  res.sendFile(__dirname + '/public/paint-socket.html');
});

// all of our routes will be prefixed with /api
app.use('/api', _router2.default);

var io = _socket2.default.listen(app.listen(port)); //start server + socket

console.log('Magic happens on port ' + port);

io.on('connection', function (socket) {
  socket.on('submit', function (doodleData) {
    io.emit('publish', doodleData);
  });
});

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("socket.io");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = __webpack_require__(0);

var _express2 = _interopRequireDefault(_express);

var _user = __webpack_require__(7);

var _user2 = _interopRequireDefault(_user);

var _chatbot = __webpack_require__(13);

var _chatbot2 = _interopRequireDefault(_chatbot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// sub-routes imports
var router = _express2.default.Router();

// test route to make sure everything is working
router.get('/', function (req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// use sub routes
router.use('/user', _user2.default);
router.use('/chatbot', _chatbot2.default);

exports.default = router;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = __webpack_require__(0);

var _express2 = _interopRequireDefault(_express);

var _user = __webpack_require__(8);

var user_controller = _interopRequireWildcard(_user);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

// define routes

router.post('/signup', user_controller.user_signup);

router.post('/login', user_controller.user_login);

// route middleware to verify a token on all following user routes
router.use(user_controller.user_verify_token);

router.get('/:id', user_controller.user_get);

exports.default = router;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.user_get = exports.user_verify_token = exports.user_login = exports.user_signup = undefined;

var _jsonwebtoken = __webpack_require__(9);

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _user = __webpack_require__(10);

var _mongo_db = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AT_STRING = 'thisisthestring';

var user_signup = exports.user_signup = function user_signup(req, res) {
	var user_temp = new _user.UserModel({
		username: req.body.username,
		password: req.body.password
	});

	user_temp.save(function (err) {
		if (err) {
			throw err;
		}
		res.status(200).json({});
	});
};

var user_login = exports.user_login = function user_login(req, res) {
	_user.UserModel.findOne({ username: req.body.username }, function (err, user) {
		if (err) throw err;

		if (user) {
			// test a matching password
			user.comparePassword(req.body.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					// if user is found and password is right - create a token
					var token = _jsonwebtoken2.default.sign(user, AT_STRING, {
						expiresIn: 180
					});

					// return the information including token as JSON
					res.status(200).json({
						success: true,
						message: 'Enjoy your token!',
						token: token
					});
				} else {
					res.json({ success: false, message: 'Authentication failed. Wrong password.' });
				}
			});
		} else {
			res.json({ success: false, message: 'Authentication failed. User not found.' });
		}
	});
};

// route middleware to verify a token
var user_verify_token = exports.user_verify_token = function user_verify_token(req, res, next) {

	// check header or url parameters or post parameters for token
	var token = req.body.token || req.query.token || req.headers['x-access-token'];

	// decode token
	if (token) {
		// verifies secret and checks exp
		_jsonwebtoken2.default.verify(token, AT_STRING, function (err, decoded) {
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;
				next();
			}
		});
	} else {
		// if there is no token - return an error
		return res.status(403).send({
			success: false,
			message: 'No token provided.'
		});
	}
};

var user_get = exports.user_get = function user_get(req, res) {
	_mongo_db.db.collection(_mongo_db.MEADOWS_COLLECTION).findOne({ 'username': req.params.id }, function (err, doc) {
		if (err) {
			handleError(res, err.message, "Failed to get meadow");
		} else {
			res.status(200).json({ username: doc.username });
		}
	});
};

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("jsonwebtoken");

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.UserModel = undefined;

var _mongoose = __webpack_require__(1);

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bcrypt = __webpack_require__(11);

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _mongo_db = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SALT_WORK_FACTOR = 10;

var userSchema = new _mongoose2.default.Schema({
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true }
});

userSchema.pre('save', function (next) {
    // generate salt and hash before sving password prop.
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    _bcrypt2.default.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        // hash the password along with our new salt
        _bcrypt2.default.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function (candidatePassword, cb) {
    // compare password method, to verify password matching
    _bcrypt2.default.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

var UserModel = exports.UserModel = _mongoose2.default.model('User', userSchema, _mongo_db.MEADOWS_COLLECTION);

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("bcrypt");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("dotenv");

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = __webpack_require__(0);

var _express2 = _interopRequireDefault(_express);

var _chatbot = __webpack_require__(14);

var chatbot_controller = _interopRequireWildcard(_chatbot);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

// define routes

router.get('/', function (req, res) {
  res.json({ message: 'hooray! welcome to our chatbot!' });
});

router.get('/webhook', function (req, res) {
  if (req.query['hub.verify_token'] === process.env.VERIFY_TOKEN) {
    res.send(req.query['hub.challenge']);
  } else {
    res.send('Error, wrong validation token');
  }
});

router.post('/webhook', chatbot_controller.webhook);

/**
 * YouTube API Test Routes
 **/

router.get('/youtube_search', chatbot_controller.youtube_search);

exports.default = router;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.youtube_search = exports.webhook = undefined;

var _request = __webpack_require__(15);

var _request2 = _interopRequireDefault(_request);

var _youtube_api = __webpack_require__(16);

var youTubeApiService = _interopRequireWildcard(_youtube_api);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var webhook = exports.webhook = function webhook(req, res) {

	// Make sure this is a page subscription
	if (req.body.object == "page") {
		// Iterate over each entry
		// There may be multiple entries if batched
		req.body.entry.forEach(function (entry) {
			// Iterate over each messaging event
			entry.messaging.forEach(function (event) {
				if (event.message) {
					processMessage(event);
				} else if (event.postback) {
					if (event.sender.id === process.env.MY_MICHAL_ID || event.sender.id === process.env.MY_ID) {
						processMyPostback(event);
					}
				}
			});
		});

		res.sendStatus(200);
	}
};

/**
 * Chatbot Functions
 **/

function processMessage(event) {
	var message = event.message;
	var senderId = event.sender.id;

	// You may get a text or attachment but not both
	if (message.text) {
		var formattedMsg = message.text.toLowerCase().trim();
		// Get user's first name from the User Profile API
		// and include it in the greeting
		/*
  request({
    url: "https://graph.facebook.com/v2.10/" + senderId,
    qs: {
  	access_token: process.env.PAGE_ACCESS_TOKEN,
  	fields: "first_name"
    },
    method: "GET"
  }, (error, response, body) => {
    if (error) {
  	console.log("Error getting user's name: " +  error);
    } else {
  	let bodyObj = JSON.parse(body);
  	let senderName = bodyObj.first_name;
  	fetchVideoAndSend(formattedMsg, senderId, senderName);
    }
    
  });
  */
		fetchVideoAndSend(formattedMsg, senderId, 'senderName');
	} else if (message.attachments) {
		sendMessage(senderId, { text: "Sorry, I don't understand your request." });
	}
}

function processMyPostback(event) {
	var senderId = event.sender.id;
	var payload = event.postback.payload;
}

function fetchVideoAndSend(formattedMessage, recipientId, recipientName) {
	youtubeApiService.searchList(formattedMessage).then(function (response, err) {
		if (err) {
			//TODO: handle error
		} else if (response && response.items[0]) {
			var videoData = response.items[0];
			var message = {
				"attachment": {
					"type": "template",
					"payload": {
						"template_type": "generic",
						"elements": [{
							"title": videoData.snippet.title,
							"image_url": videoData.snippet.thumbnails.medium.url,
							"subtitle": videoData.snippet.description,
							"default_action": {
								"type": "web_url",
								"url": 'https://www.youtube.com/watch?v=' + videoData.id.videoId
							}
						}]
					}
				}
			};
			sendMessage(recipientId, message);
		}
	});
}

// sends message to user
function sendMessage(recipientId, message) {
	(0, _request2.default)({
		url: "https://graph.facebook.com/v2.10/me/messages",
		qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
		method: "POST",
		json: {
			recipient: { id: recipientId },
			message: message
		}
	}, function (error, response, body) {
		if (error) {
			console.log("Error sending message: " + response.error);
		} else {
			//console.log(response);
		}
	});
}

/**
 * YouTube API Test functions
 **/

var youtube_search = exports.youtube_search = function youtube_search(req, res) {
	youTubeApiService.searchList(req.query['query_string']).then(function (searchListRepoonse, err) {
		if (err) {
			handleError(res, err.message, "searchList Error");
		} else {
			res.status(200).json(searchListRepoonse);
		}
	});
};

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = require("request");

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.searchList = undefined;

var _googleapis = __webpack_require__(17);

var _googleapis2 = _interopRequireDefault(_googleapis);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var urlshortener = _googleapis2.default.urlshortener('v1');
var youtube = _googleapis2.default.youtube('v3');

var constQuery = 'Paul Simon';

var searchList = exports.searchList = function searchList(queryString) {
	var searchListPromise = new Promise(function (resolve, reject) {

		youtube.search.list({
			auth: process.env.API_KEY,
			maxResults: '1',
			part: 'snippet',
			q: constQuery + ' ' + queryString
		}, function (err, response) {
			if (err) {
				reject('searchList error');
			} else {
				resolve(response);
			}
		});
	});

	return searchListPromise;
};

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = require("googleapis");

/***/ })
/******/ ]);
//# sourceMappingURL=server.js.map