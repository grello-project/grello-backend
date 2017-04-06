'use strict'

let mongoose = require('mongoose')
let jwt = require('jsonwebtoken')

let userSchema = mongoose.Schema({
  googleID: {type: String, required: true, unique: true},
  name: {type: String, required: true, unique: true},
  email: {type: String, required: true},
  profilePic: String,
  refreshToken: String,
  accessToken: String,
  tokenTTL: Number,
  tokenTimestamp: Date,
})

userSchema.methods.generateToken = function() {
  return new Promise ((resolve, reject) => {
    let token = jwt.sign({id: this._id}, process.env.SECRET || 'DEV')
    if(!token) {
      reject('could not generate token')
    }
    resolve(token)
  })
}

module.exports = mongoose.model('users', userSchema)
