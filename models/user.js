'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
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

const User = mongoose.model('User', userSchema);

module.exports = User;
