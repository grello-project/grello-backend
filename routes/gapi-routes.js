'use strict'

const Router = require('express').Router
const request = require('superagent')

const google = require('googleapis')
const OAuth2Client = google.auth.OAuth2

let redirect_url = 'http://localhost:3000/gapi-auth/success'

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
