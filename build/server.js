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
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _dotenv = __webpack_require__(6);

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

var config = {
    env: process.env.NODE_ENV,
    app: {
        port: process.env.PORT || 8080
    },
    databases: {
        mongodb: {
            uri: process.env.MONGODB_URI,
            usersCollection: 'meadows'
        }
    },
    chatbot: {
        verifyToken: process.env.VERIFY_TOKEN,
        pageAccessToken: process.env.PAGE_ACCESS_TOKEN
    },
    services: {
        youtube_api: {
            apiKey: process.env.API_KEY
        }
    }
};

exports.default = config;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("mongoose");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _mongoose = __webpack_require__(2);

var _mongoose2 = _interopRequireDefault(_mongoose);

var _express = __webpack_require__(1);

var _express2 = _interopRequireDefault(_express);

var _socket = __webpack_require__(4);

var _socket2 = _interopRequireDefault(_socket);

var _bodyParser = __webpack_require__(5);

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _config = __webpack_require__(0);

var _config2 = _interopRequireDefault(_config);

var _router = __webpack_require__(7);

var _router2 = _interopRequireDefault(_router);

var _socketBindings = __webpack_require__(18);

var socketBindings = _interopRequireWildcard(_socketBindings);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;


//init mongodb connection
_mongoose2.default.connection.on("open", function (ref) {
  console.log("Connected to mongo server.");
});

_mongoose2.default.connection.on("error", function (err) {
  console.log("Could not connect to mongo server!", err);
});

_mongoose2.default.connect(_config2.default.databases.mongodb.uri, { useMongoClient: true });

var app = (0, _express2.default)();

// configure app to use bodyParser()
app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.use(_bodyParser2.default.json());

//define public directory
app.use("/", _express2.default.static(__dirname + '/public'));

// define served pages
app.get('/paint-socket', function (req, res) {
  res.sendFile(__dirname + '/public/paint-socket.html');
});

// all of our routes will be prefixed with /api
app.use('/api', _router2.default);

// configure error handler
app.use(function (err, req, res, next) {
  console.error(err);
  res.status(500).json({ success: false, message: err });
});

// configure 404 handler
app.use(function (req, res, next) {
  res.status(404).send('Sorry, not found.');
});

//start server + socket
var io = _socket2.default.listen(app.listen(_config2.default.app.port));

// init. socket bindings
socketBindings.bind(io);

console.log('Magic happens on port ' + _config2.default.app.port + ', on environment \'' + _config2.default.env + '\'.');

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
/***/ (function(module, exports) {

module.exports = require("dotenv");

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = __webpack_require__(1);

var _express2 = _interopRequireDefault(_express);

var _user = __webpack_require__(8);

var _user2 = _interopRequireDefault(_user);

var _chatbot = __webpack_require__(13);

var _chatbot2 = _interopRequireDefault(_chatbot);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// sub-routes imports
var router = _express2.default.Router();

// test route to make sure everything is working
router.get('/', function (req, res) {
    res.status(200).json({ success: true, message: 'hooray! welcome to our api!' });
});

// use sub routes
router.use('/user', _user2.default);
router.use('/chatbot', _chatbot2.default);

exports.default = router;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = __webpack_require__(1);

var _express2 = _interopRequireDefault(_express);

var _user = __webpack_require__(9);

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
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.user_get = exports.user_verify_token = exports.user_login = exports.user_signup = undefined;

var _jsonwebtoken = __webpack_require__(10);

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _user = __webpack_require__(11);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AT_STRING = 'thisisthestring';

var user_signup = exports.user_signup = function user_signup(req, res, next) {
	var user_temp = new _user.UserModel({
		username: req.body.username,
		password: req.body.password
	});

	user_temp.save(function (err) {
		if (err) {
			next(err);
		} else {
			res.status(200).json({ success: true });
		}
	});
};

var user_login = exports.user_login = function user_login(req, res, next) {
	_user.UserModel.findOne({ username: req.body.username }, function (err, user) {
		if (err) {
			next(err);
		} else if (user) {
			// test a matching password
			user.comparePassword(req.body.password, function (err, isMatch) {
				if (err) {
					next(err);
				} else if (isMatch) {
					// if user is found and password is right - create a token
					var token = _jsonwebtoken2.default.sign(user, AT_STRING, {
						expiresIn: 180
					});

					// return the information including token as JSON
					res.status(200).json({ success: true, data: { token: token }, message: 'Enjoy your token!' });
				} else {
					res.status(401).json({ success: false, message: 'Authentication failed. Wrong password.' });
				}
			});
		} else {
			res.status(401).json({ success: false, message: 'Authentication failed. User not found.' });
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
				next(err);
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;
				next();
			}
		});
	} else {
		// if there is no token - return an error
		return res.status(401).send({ success: false, message: 'No token provided.' });
	}
};

var user_get = exports.user_get = function user_get(req, res, next) {
	_user.UserModel.findOne({ 'username': req.params.id }, function (err, doc) {
		if (err) {
			next(err);
		} else if (doc) {
			res.status(200).json({ success: true, data: { username: doc.username } });
		} else {
			next();
		}
	});
};

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("jsonwebtoken");

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.UserModel = undefined;

var _mongoose = __webpack_require__(2);

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bcrypt = __webpack_require__(12);

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _config = __webpack_require__(0);

var _config2 = _interopRequireDefault(_config);

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

var UserModel = exports.UserModel = _mongoose2.default.model('User', userSchema, _config2.default.databases.mongodb.usersCollection);

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("bcrypt");

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = __webpack_require__(1);

var _express2 = _interopRequireDefault(_express);

var _config = __webpack_require__(0);

var _config2 = _interopRequireDefault(_config);

var _chatbot = __webpack_require__(14);

var chatbot_controller = _interopRequireWildcard(_chatbot);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

// define routes

router.get('/', function (req, res) {
  res.status(200).json({ success: true, message: 'hooray! welcome to our chatbot!' });
});

router.get('/webhook', function (req, res) {
  if (req.query['hub.verify_token'] === _config2.default.chatbot.VERIFY_TOKEN) {
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

var _config = __webpack_require__(0);

var _config2 = _interopRequireDefault(_config);

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
					//TODO: process postbacks
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
	youTubeApiService.searchList(formattedMessage).then(function (response, err) {
		if (err) {
			console.error("Error searching video", err); //TODO: handle error
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
		qs: { access_token: _config2.default.chatbot.pageAccessToken },
		method: "POST",
		json: {
			recipient: { id: recipientId },
			message: message
		}
	}, function (error, response, body) {
		if (error) {
			console.error("Error sending message", error);
		} else {
			console.log(response);
		}
	});
}

/**
 * YouTube API Test functions
 **/

var youtube_search = exports.youtube_search = function youtube_search(req, res, next) {
	youTubeApiService.searchList(req.query['query_string']).then(function (searchListRepoonse, err) {
		if (err) {
			next(err);
		} else {
			res.status(200).json({ success: true, data: searchListRepoonse });
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

var _config = __webpack_require__(0);

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var urlshortener = _googleapis2.default.urlshortener('v1');
var youtube = _googleapis2.default.youtube('v3');

var constQuery = 'Paul Simon';

var searchList = exports.searchList = function searchList(queryString) {
	var searchListPromise = new Promise(function (resolve, reject) {

		youtube.search.list({
			auth: _config2.default.services.youtube_api.apiKey,
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

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.bind = bind;

var _paintSocket = __webpack_require__(19);

var paintSocketBindings = _interopRequireWildcard(_paintSocket);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function bind(io) {

    paintSocketBindings.bind(io.of('/paint-socket'));
}

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.bind = bind;
function bind(io) {
    io.on('connection', function (socket) {
        socket.on('submit', function (doodleData) {
            io.emit('publish', doodleData);
        });
    });
}

/***/ })
/******/ ]);
//# sourceMappingURL=server.js.map