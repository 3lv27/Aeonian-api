'use strict';

const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const User = require('../models/User');

function config() {
    passport.serializeUser((user, cb) => {
        cb(null, user._id);
    });

    passport.deserializeUser((id, cb) => {
        User.findOne({ '_id': id }, (err, user) => {
            if (err) { return cb(err); }
            cb(null, user);
        });
    });

    // app.use(flash());
    passport.use(new LocalStrategy({ passReqToCallback: true }, (req, username, password, next) => {
        User.findOne({ username }, (err, user) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                return next(null, false, { message: 'Incorrect username' });
            }
            if (!bcrypt.compareSync(password, user.password)) {
                return next(null, false, { message: 'Incorrect password' });
            }

            return next(null, user);
        });
    }));
}

module.exports = config;