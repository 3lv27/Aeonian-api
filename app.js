'use strict';

const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const expressLayouts = require('express-ejs-layouts');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo')(session);
const cors = require('cors');

const configurePassport = require('./helpers/passport');
const response = require('./helpers/response');

const auth = require('./routes/auth');
const challenges = require('./routes/challenges');

const app = express();

// database config
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/aeonian', {
  keepAlive: true,
  reconnectTries: Number.MAX_VALUE,
  useMongoClient: true
});

// session config
app.use(session({
  secret: 'our-passport-local-strategy-app',
  resave: true,
  saveUninitialized: true
}));

// passport config
configurePassport();
app.use(passport.initialize());
app.use(passport.session());


// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.locals = {
    user: req.user
  };
  next();
});


app.use(function (req, res, next) {
  //set headers to allow cross origin request.
  res.header("Access-Control-Allow-Origin", 'http://localhost:8080');
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

//  routes
app.use('/', auth);
app.use('/challenges', challenges);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  res.render('not-found');
});

// error handler
app.use(function (err, req, res, next) {
  // always log the error
  console.error('ERROR', req.method, req.path, err);

  // only send response if the error ocurred before sending the response
  if (!res.headersSent) {
    return response.unexpectedError(req, res);
  };
});

module.exports = app;
