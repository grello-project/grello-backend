'use strict'

const Router = require('express').Router
const googleOAUTH = require('../lib/google-oauth-middleware.js')
const getFiles = require('../lib/files.js')
const User = require('../model/user.js')

const router = module.exports = new Router()

router.get('/auth/google/callback', googleOAUTH, (req, res, next) => {
  let existingUser

  // if googleError deal with google Error
  if(req.googleError){
    return res.redirect('http://localhost:8080')
  }

  User.findOne({email: req.googleOAUTH.email})
  .then(user => {
    if (!user) {
      let userData = {
        googleID: req.googleOAUTH.googleID,
        name: req.googleOAUTH.name,
        email: req.googleOAUTH.email,
        profilePic: req.googleOAUTH.profilePic,
        accessToken: req.googleOAUTH.accessToken,
        refreshToken: req.googleOAUTH.refreshToken,
        tokenTTL: req.googleOAUTH.tokenTTL,
        tokenTimestamp: Date.now() / 1000,
        expiration: (Date.now() / 1000) + req.googleOAUTH.tokenTTL,
      }
      user = new User(userData).save()
    } else {
      console.log('user exists:', user)
      existingUser = true
    }
    return Promise.resolve(user)
  })
  .then(user => {
    if (existingUser) {
      return Promise.resolve(user)
    }
    return getFiles(user)
  })
  .then(user => user.generateToken())
  .then(token => {
    console.log(token)
    res.redirect(`http://localhost:8080/#!/join?token=${token}`)
  })
  .catch(next)
})
