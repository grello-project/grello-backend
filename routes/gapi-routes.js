'use strict'

const DELAY = 200

const Router = require('express').Router
const router = module.exports = new Router()

const FRONTEND_URL = process.env.WATTLE_URL || 'http://localhost:8080'

const authenticateAndSaveUser = require('../lib/authenticateAndSaveUser')
const getFiles = require('../lib/getFiles')
const getTasks = require('../lib/getTasks')
const batchSave = require('../lib/batchSaveFilesAndTasks')

let oauth2Client = require('../lib/oauth2Client')

let scopes = [
  'openid',
  'email',
  'profile',
  'https://www.googleapis.com/auth/plus.me',
  'https://www.googleapis.com/auth/drive',
]

let url = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
})


router.get('/gapi/auth', (req, res) => {
  res.redirect(url)
})

router.get('/gapi/auth/success', (req, res, next) => {
  authenticateAndSaveUser(req.query.code, req.body)
  .then(user => {
    if (user.timesLoggedIn > 0) {
      return Promise.resolve(user)
    }
    else {
      // TODO: SET WATCH DRIVE HERE
      console.log('WE ARE ABOUT TO GET FILES')
      return getFiles(user)
        .then(filesResults => {
          // TODO: get rid of this slice before going live!!!!
          console.log('THESE ARE THE FILE RESULTS', filesResults)
          return Promise.all(filesResults.files.map((file, index) => {
            console.log('DO WE END UP IN FILES MAP')
            return new Promise((resolve, reject) => {
              setTimeout(function () {
                return getTasks(file, user)
                  .then(resolve)
                  .catch(reject)
              }, DELAY*index)
            })
          }))
        })
        .then(commentsResults => {
          console.log('DO WE END UP IN COMMENTS RESULTS YOOYOYO')
          return batchSave(commentsResults, user)
        })
    }
  })
  .then(user => {
    console.log('AT THE END!!')
    user.generateToken()
  })
  .then(token => {
    console.log('ACTUALLY THE END')
    res.redirect(`${FRONTEND_URL}/#!/join?token=${token}`)
  })
  .catch(next)
})
