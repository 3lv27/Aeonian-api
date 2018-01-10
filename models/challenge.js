'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const challengeSchema = new Schema({
  challengeName: String,
  owner: {
    type: ObjectId,
    ref: 'User'
  },
  location: { type: { type: String }, coordinates: [Number] },
  sports: {
    type: String,
    enum: ['SkateBoarding', 'BMX', 'Parkour', 'Fitness', 'RollerSkating']
  },
  description: String,
  linkValidation: String,
  timelimit: Date,
  enrolled: [{
    type: ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

challengeSchema.index({ location: '2dsphere' });
const Challenge = mongoose.model('Challenge', challengeSchema);

module.exports = Challenge;
