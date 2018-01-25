'use strict';

const passport = require('passport');
const ensureLogin = require('connect-ensure-login');
const express = require('express');
const router = express.Router();

// User model
const User = require('../models/User').User;

// Bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

// response helper
const response = require('../helpers/response');

/* _____ SIGNUP __________ */


router.post('/signup', (req, res, next) => {
  if (req.user) {
    return response.forbidden(req, res);
  }
  const {
    username,
    email,
    password
  } = req.body;

  if (!username || !email || !password) {
    return response.unprocessable(req, res);
  }


  User.findOne({username
  
  }, (err,  userExist) => {
    if (err) {
      return next(err);
    }
    else if (userExist) {
      return response.unprocessable(req, res, 'Username or email already in use.');
    }
    else {

      const salt = bcrypt.genSaltSync(10);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = User({
        username,
        email,
        password: hashPass
      });

      newUser.save((err) => {
        if (err) {
          return next(err);
        }
        req.login(newUser, (err) => {
          if (err) {
            return next(err);
          }
          return response.data(req, res, newUser);
        });
      });
    }
   


  });
});


/* _____ LOGIN __________ */


router.post('/login', (req, res, next) => {
  if (req.user) {
    return response.forbidden(req, res);
  }
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return response.notFound(req, res);
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return response.data(req, res, req.user);
    });
  })(req, res, next);
});



router.get('/resume/:id', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  const id = req.params.id;
  User.findOne({ _id: id }, (req, res, data) => {
    if (err) return next(err)
    return Response.data(req, res, data)
  });
});


/* _____ LOGOUT__________ */

router.post('/logout', (req, res) => {
  req.logout();
  return response.ok(req, res);
});



module.exports = router;



