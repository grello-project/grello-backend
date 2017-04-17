'use strict'

const Router = require('express').Router
const router = module.exports = new Router()

const FRONTEND_URL = process.env.WATTLE_URL || 'http://localhost:8080'
// const BACKEND_URL = process.env.API_URL || 'http://localhost:3000'

// const getFiles = require('../lib/files.js')
const authenticateAndSaveUser = require('../lib/authenticateAndSaveUser')
const getFiles = require('../lib/getFiles')
const getTasks = require('../lib/getTasks')

let oauth2Client = require('../lib/oauth2Client')

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


router.get('/gapi/auth', (req, res) => {
  res.redirect(url)
})

router.get('/gapi/auth/success', (req, res) => {
  console.log('entered success route')
  authenticateAndSaveUser(req.query.code)
    .then(user => {
      if (user.timesLoggedIn > 0) {
        console.log('user already exists, skipping file/task saving functions')
        return Promise.resolve(user)
      }
      else {
        console.log('getting files')
        // TODO: SET WATCH DRIVE HERE
        return getFiles(user)
        .then(filesResults => {
          console.log('Files results:\n\n', filesResults.files[0], '\n\n')
          console.log('getting comments')
          // TODO: get rid of this slice before going live!!!!
          return Promise.all(filesResults.files.slice(0,3).map(file => {
            return getTasks(file, user)
          }))
        })
        .then(commentsResults => {
          console.log('here are the comments results:\n\n', commentsResults, '\n\n')
          return Promise.resolve(commentsResults[0].user)
        })
        // TODO: SAVE FILES HERE THEN generateToken
      }
    })
    .then(user => user.generateToken())
    .then(token => res.redirect(`${FRONTEND_URL}/#!/join?token=${token}`))
    .catch(err => console.error(err))
})
