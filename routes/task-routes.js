'use strict'

const Task = require('../model/task.js')
const bearerAuth = require('../lib/bearer-auth-middleware')

const Router = require('express').Router
const router = module.exports = new Router()

router.get('/api/tasks', bearerAuth, (req, res, next) => {
  Task
  .find({userID: req.user._id})
  .populate('category')
  .then(tasks => res.json(tasks))
  .catch(next)
})

router.put('/api/tasks/:id', bearerAuth, (req, res, next) => {

// To refresh an access token, your application sends an HTTPS POST request
// to Google's authorization server
// (https://www.googleapis.com/oauth2/v4/token) that includes the following
// parameters:
// refresh_token The refresh token returned from the authorization code exchange.
// client_id
// client_secret
// grant_type this field must contain a value of refresh_token.
// SAMPLE request
// POST /oauth2/v4/token HTTP/1.1
// Host: www.googleapis.com
// Content-Type: application/x-www-form-urlencoded
//
// client_id=<your_client_id>&
// client_secret=<your_client_secret>&
// refresh_token=<refresh_token>&
// grant_type=refresh_token

// SAMPLE response
// {
//   "access_token":"1/fFAGRNJru1FTz70BzhT3Zg",
//   "expires_in":3920,
//   "token_type":"Bearer"
// }

// PATCH / PUT https://www.googleapis.com/drive/v3/files/fileId/comments/commentId

  Task.findByIdAndUpdate(req.params.id, req.body, {new: true})
  .then(task => res.json(task))
  .catch(next)
})
