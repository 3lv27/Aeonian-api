'use strict';

const passport = require('passport');
const ensureLogin = require('connect-ensure-login');
const express = require('express');
const router = express.Router();

const Challenge = require('../models/Challenge');
const response = require('./helpers/response');


router.get('/select-sport', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  Challenge.find({}, 'sports', (err, sports) => {
    if (err) {
      return next(err);
    }
    const sport = Challenge.schema.path('sports').enumValues;
    const data = {
      sports: sport,
    };
    response.data(req, res, data);
  });
});

router.post('/select-sport/', (req, res, next) => {
  const sport = req.body.sport;
  const fakeLocation = {
    type: 'Point',
    coordinates: [0, 0]
  };

  const newChallenge = new Challenge({
    challengeName: null,
    owner: req.user._id,
    location: fakeLocation,
    sports: sport,
    description: null,
    linkValidation: null,
    timelimit: null,
    enrolled: null
  });

  newChallenge.save((err, result) => {
    if (err) {
      return next(err);
    }
  });
});

router.get('/edit/:id', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  const data = {
    challengeId: req.params.id,
  };
  response.data(req, res, data);
});

router.post('/edit/:id', (req, res, next) => {
  const challengeName = req.body.challengeName;
  const description = req.body.description;
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;

  let location = {
    type: 'Point',
    coordinates: [longitude, latitude]
  };

  const newChallenge = {
    challengeName,
    location,
    description,
    enrolled: []
  };

  Challenge.findOneAndUpdate({ _id: req.params.id }, { $set: newChallenge }, (err, result) => {
    if (err) {
      return next(err);
    }
    return reponse.data(req, res, result)
  });
});

router.get('/search', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  Challenge.find({ }, (req, res, data) =>{
    if (err) return next(err)
    return response.data(req, res, data)
  });


router.get('/:id', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  const ChallengeId = req.params.id;
  const UserId = req.user._id;
  Challenge.findOne({ _id: ChallengeId }, (req, res, data) => {
    if (err) return next(err)
    const isEnrolled = false;
    data.challenge.enrolled.forEach((item) => {
      if ((item + '') == (UserId + '')) {
        isEnrolled = true;
      }
    });
  });
    return response.data(req, res, data)
  });
 
});

router.post('/:id', (req, res, next) => {
  const ChallengeId = req.params.id;
  const UserId = req.user._id;
  Challenge.findOneAndUpdate({ _id: ChallengeId }, { $set: challenge}, (req, res, data)=> {
    if(err) {
      return next(err)
    } else {
    data.enrolled.push(UserId)
    return response.data(req, res, data)
    }
    
  });
 
});

router.get('/:id/finished', ensureLogin.ensureLoggedIn(), (req, res, next) => {
  const ChallengeId = req.params.id;
  Challenge.findOne({ _id: ChallengeId }, (req, res, data) => {
    if (err) return next(err)
    return response.data(req, res, data)
  });
});

router.post('/:id/finished', (req, res, next) => {
  const link = req.body.Link;
  const ChallengeId = req.params.id;
  Challenge.findOneAndUpdate({ _id: ChallengeId }, { $set: { linkValidation: link } }, (req, res, data) => {
    if(err) return next(err)
    return response.data(req, res, data)
  });
});




router.post('/:id/results', (req, res, next) => {
  const ChallengeId = req.params.id;
  Challenge.findOne({ _id: ChallengeId }, (req, res, data) => {
    if (err) return next(err)
    const userId = req.user._id + '';
    let newEnrolleds = [];
    data.enrolled.forEach((userEnrolled, index) => {
      if (userEnrolled + '' !== userId) {
        newEnrolleds.push(userEnrolled);
      }

    });
    const data = {
      linkValidation: '',
      enrolled: newEnrolleds
    };

  Challenge.update({ _id: ChallengeId }, { $set: data }, (err, result) => {
      if (err) {
        return next(err);
      }
      return response.data(req, res, results);
      });
    });
  });

module.exports = router;
