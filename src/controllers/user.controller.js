import jwt from 'jsonwebtoken';

import {UserModel} from '../models/user.model';

import {db, MEADOWS_COLLECTION} from '../databases/mongo_db';

const AT_STRING = 'thisisthestring';

export const user_signup = (req, res) => {
	let user_temp = new UserModel({
		username: req.body.username,
		password: req.body.password
	});
	
	user_temp.save((err) => {
		if (err) { throw err; }
		res.status(200).json({});
	  });
};

export const user_login = (req, res) => {
	UserModel.findOne({ username: req.body.username }, (err, user) => {
		if (err) throw err;
		
		if (user) {
			// test a matching password
			user.comparePassword(req.body.password, (err, isMatch) => {
				if (err) throw err;
				if (isMatch) {
					// if user is found and password is right - create a token
					let token = jwt.sign(user, AT_STRING, {
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
export const user_verify_token = (req, res, next) => {

  // check header or url parameters or post parameters for token
  let token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, AT_STRING, (err, decoded) => {      
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

export const user_get = (req, res) => {
	db.collection(MEADOWS_COLLECTION).findOne({ 'username': req.params.id }, (err, doc) => {
			if (err) {
			  handleError(res, err.message, "Failed to get meadow");
			} else {
			  res.status(200).json({ username: doc.username });
			}
		  });
};

