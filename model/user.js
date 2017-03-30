'use strict'

let mongoose = require('mongoose')

let userSchema = mongoose.Schema({
  googleID: {type: String, required: true, unique: true},
  refreshToken: String,
  accessToken: String,
  name: {type: String, required: true, unique: true},
  email: {type: String, required: true},
  tasks: [{type: mongoose.Schema.Types.ObjectId, ref: 'tasks'}],
  tags: [{type: mongoose.Schema.Types.ObjectId, ref: 'tags'}],
  profilePic: String,

})

module.exports = mongoose.model('users', userSchema)
