'use strict';

const passport = require('passport');
const ensureLogin = require('connect-ensure-login');
const express = require('express');
const router = express.Router();

// User model
const User = require('../models/user');

// Bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

/* _____ SIGNUP __________ */

router.get('/signup', (req, res, next) => {
  res.render('auth/signup', { layout: 'layouts/main' });
});

router.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === '' || password === '') {
    res.render('auth/signup', { message: 'Indicate username and password' });
    return;
  }

  User.findOne({ username }, 'username', (err, user) => {
    if (err) {
      next(err);
      return;
    }

    if (user) {
      const data = {
        message: 'The username already exists'
      };
      res.render('auth/signup', data), { layout: 'layouts/main' };
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        next(err);
        return;
      }

      req.login(newUser, () => {
        res.redirect('/home');
      });
    });
  });
});

/* _____ LOGIN __________ */

router.get('/login', (req, res, next) => {
  res.render('auth/login'), { layout: 'layouts/main' };
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/login',
  failureFlash: true,
  passReqToCallback: true
}));

// private user page
router.get('/home', ensureLogin.ensureLoggedIn(), (req, res) => {
  const data = {
    user: req.user,
    layout: 'layouts/main2'
  };
  res.render('auth/home', data);
});

router.get('/resume/:id', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  const id = req.params.id;
  const promise = User.findOne({ _id: id });
  promise.then((result) => {
    const data = {
      user: result,
      layout: 'layouts/main2'
    };
    res.render('auth/resume', data);
  });
  promise.catch((error) => {
    next(error);
  });
});

/* _____ LOGOUT__________ */

router.post('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});



module.exports = router;
