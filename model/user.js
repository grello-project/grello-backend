'use strict'

let mongoose = require('mongoose')
let jwt = require('jsonwebtoken')

let userSchema = mongoose.Schema({
  googleID: {type: String, required: true, unique: true},
  name: {type: String, required: true, unique: true},
  email: {type: String, required: true},
  profilePic: String,
  createDate: Date,
  lastLogin: Date,
  refreshToken: String,
  accessToken: String,
  tokenTTL: Number,
  tokenTimestamp: Number,
  expiration: Number,
  timesLoggedIn: {type: Number, default: 0}
})

userSchema.methods.generateToken = function() {
  return new Promise ((resolve) => {
    let token = jwt.sign({id: this._id}, process.env.SECRET || 'DEV')
    resolve(token)
  })
}

module.exports = mongoose.model('users', userSchema)
