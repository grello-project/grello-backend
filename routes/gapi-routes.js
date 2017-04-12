'use strict'

const Router = require('express').Router
// const request = require('superagent')

const google = require('googleapis')
const plus = google.plus('v1')
const OAuth2Client = google.auth.OAuth2

let redirect_url = 'http://localhost:3000/gapi/auth/success'

let oauth2Client = new OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET, redirect_url)

let scopes = [
  'https://www.googleapis.com/auth/plus.me'
]

let url = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
})

const router = module.exports = new Router()

router.get('/gapi/auth', (req, res) => {
  res.send(url)
})

router.get('/gapi/auth/success', (req, res) => {
  oauth2Client.getToken(req.query.code, (err, tokens) => {
    if (err) console.error(err)
    oauth2Client.setCredentials(tokens)
  })
  // plus.people.get({userId: 'me', auth: oauth2Client}, (err, profile) => {
  //   if (err) console.error(err)
  //   console.log(profile)
  // })
})
