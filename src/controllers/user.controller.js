import jwt from 'jsonwebtoken';

import { UserModel } from '../models/user.model';

const AT_STRING = 'thisisthestring';

export const user_signup = (req, res, next) => {
	let user_temp = new UserModel({
		username: req.body.username,
		password: req.body.password
	});

	user_temp.save((err) => {
		if (err) {
			next(err);
		} else {
			res.status(200).json({ success: true });
		}
	});
};

export const user_login = (req, res, next) => {
	UserModel.findOne({ username: req.body.username }, (err, user) => {
		if (err) {
			next(err);
		} else if (user) {
			// test a matching password
			user.comparePassword(req.body.password, (err, isMatch) => {
				if (err) {
					next(err);
				} else if (isMatch) {
					// if user is found and password is right - create a token
					let token = jwt.sign(user, AT_STRING, {
						expiresIn: 180
					});

					// return the information including token as JSON
					res.status(200).json({ success: true, data: { token }, message: 'Enjoy your token!' });
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
export const user_verify_token = (req, res, next) => {

	// check header or url parameters or post parameters for token
	let token = req.body.token || req.query.token || req.headers['x-access-token'];

	// decode token
	if (token) {
		// verifies secret and checks exp
		jwt.verify(token, AT_STRING, (err, decoded) => {
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

export const user_get = (req, res, next) => {
	UserModel.findOne({ 'username': req.params.id }, (err, doc) => {
		if (err) {
			next(err);
		} else if (doc) {
			res.status(200).json({ success: true, data: { username: doc.username } });
		} else {
			next();
		}
	});
};

