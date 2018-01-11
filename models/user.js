'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: String,
  email: String,
  password: String,
  personalData: {
    name: String,
    surname: String,
    age: Number,
    nationality: String
  },
  sports: {
    type: [String],
    enum: ['SkateBoarding', 'BMX', 'Parkour', 'Fitness', 'RollerSkating']
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const User = mongoose.model('User', UserSchema);

module.exports = { User };
