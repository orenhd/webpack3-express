import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import config from '../config';

const SALT_WORK_FACTOR = 10;

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true, select: false }, // exclude password from select, unless explicitly requested
    friends: { type: [String], default: [] },
});

userSchema.pre('save', function(next) { // generate salt and hash before sving password prop.
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
        if (err) return next(err);

        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, callback) { // compare password method, to verify password matching
    if (callback) {
      bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) return callback(err);
        callback(null, isMatch);
      });
    } else {
      return bcrypt.compare(candidatePassword, this.password); // returns a promise
    }
};

export const UserModel = mongoose.model('User', userSchema, config.databases.mongodb.usersCollection);

