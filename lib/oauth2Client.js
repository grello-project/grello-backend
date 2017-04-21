'use strict'

const BACKEND_URL = process.env.API_URL || 'http://localhost:3000'
const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URL = `${BACKEND_URL}/gapi/auth/success`

const google = require('googleapis')
const OAuth2 = google.auth.OAuth2

module.exports = new OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL
)
