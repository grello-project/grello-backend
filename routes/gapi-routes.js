'use strict'

const Router = require('express').Router

const FRONTEND_URL = process.env.WATTLE_URL || 'http://localhost:8080'
const BACKEND_URL = process.env.API_URL || 'http://localhost:3000'

const google = require('googleapis')
const plus = google.plus('v1')

// const getFiles = require('../lib/files.js')
const getDocs = require('../lib/gapi-getDocs')
const User = require('../model/user.js')

let oauth2Client = require('../lib/gapi-OAuth2')

let scopes = [
  'openid',
  'email',
  'https://www.googleapis.com/auth/plus.me',
  'https://www.googleapis.com/auth/drive'
]

let url = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
})

const router = module.exports = new Router()

router.get('/gapi/auth', (req, res) => {
  res.redirect(url)
})

router.get('/gapi/auth/success', (req, res) => {
  console.log('entered success route')
  oauth2Client.getToken(req.query.code, (err, tokens) => {
    if (err) return console.error(err)
    oauth2Client.setCredentials(tokens)
    plus.people.get({userId: 'me', auth: oauth2Client}, (err, profile) => {
      let existingUser
      if (err) console.error(err)
      User.findOne({googleID: profile.id})
        .then(user => {
          if (!user) {
            let userData = {
              googleID: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value,
              profilePic: profile.image.url,
              accessToken: tokens.access_token,
              refreshToken: tokens.refresh_token,
              expiration: tokens.expiry_date,
            }
            user = new User(userData).save()
          } else {
            existingUser = true
          }
          return Promise.resolve(user)
        })
        .then(user => {
          if (existingUser) return Promise.resolve(user)
          // return getFiles(user)
          console.log('getting docs')
          return getDocs(user)
        })
        .then(results => {
          console.log('results =', results)
          return Promise.resolve(results.user)
        })
        .then(user => user.generateToken())
        .then(token => res.redirect(`${FRONTEND_URL}/#!/join?token=${token}`))
        .catch(err => Promise.reject(err))
    })
  })
})
