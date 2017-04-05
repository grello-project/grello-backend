'use strict'

const Router = require('express').Router
const googleOAUTH = require('../lib/google-oauth-middleware.js')
const getFiles = require('../lib/files.js')
const User = require('../model/user.js')

const router = module.exports = new Router()

router.get('/auth/google', (req, res) => {
  const googleAuthBase = 'https://accounts.google.com/o/oauth2/v2/auth'
  const googleAuthResponseType = 'response_type=code'
  const googleAuthClientID = `client_id=${process.env.CLIENT_ID}`
  const googleAuthScope = 'scope=profile%20email%20openid%20https://www.googleapis.com/auth/drive'
  const googleAuthRedirectURI = 'redirect_uri=http://localhost:3000/auth/google/callback'
  const googleAuthAccessType = 'access_type=offline'
  const googleAuthPrompt = 'prompt=consent'

  const googleAuthURL = `${googleAuthBase}?${googleAuthResponseType}&${googleAuthClientID}&${googleAuthScope}&${googleAuthRedirectURI}&${googleAuthAccessType}&${googleAuthPrompt}`

  res.redirect(googleAuthURL)
})

router.get('/auth/google/callback', googleOAUTH, (req, res, next) => {
  // if googleError deal with google Error
  if(req.googleError){
    return res.redirect('/')
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
        tokenTimestamp: Date.now()
      }
      user = new User(userData).save()
    }
    return Promise.resolve(user)
  })
  .then(user => {
    return getFiles(user)
  })
  .then(user => user.generateToken())
  .then(token => {
    console.log(token)
    res.redirect(`http://localhost:8080/#!/join?token=${token}`)
  })
  .catch(next)
})
