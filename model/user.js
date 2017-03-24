'use strict'

let mongoose = require('mongoose')

let userSchema = mongoose.Schema({
  googleID: {type: String, required: true, unique: true},
  username: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  email: {type: String, required: true},
  tasks: [{type: mongoose.Schema.Types.ObjectId, ref: 'tasks'}],
})

module.exports = mongoose.model('users', userSchema)
