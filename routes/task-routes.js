'use strict'

const request = require('superagent')

const Task = require('../model/task.js')
const bearerAuth = require('../lib/bearer-auth-middleware')
const refreshToken = require('../lib/refresh-token-middleware')

const Router = require('express').Router
const router = module.exports = new Router()

router.get('/api/tasks', bearerAuth, (req, res, next) => {
  Task
  .find({userID: req.user._id})
  .populate('category')
  .then(tasks => res.json(tasks))
  .catch(next)
})

router.put('/api/tasks/:id', bearerAuth, refreshToken, (req, res, next) => {
  console.log('IN THE API/TASK/ID ROUTE')
  req.body.resolved = true

  Task.findByIdAndUpdate(req.params.id, req.body, {new: true})
  .then(task => {
    console.log('ADD CONTENT TO REQ.BODY', req.body)
    req.body.content = task.comment

    request.patch(`https://www.googleapis.com/drive/v3/files/${task.document}/comments/${task.googleID}?fields=author%2Ccontent%2Cdeleted%2ChtmlContent%2Cid%2CquotedFileContent%2Cresolved`)
    .set('Authorization', `Bearer ${req.user.accessToken}`)
    .send(req.body)
    .then(resp => {
      console.log('HERE IS OUR UPDATED COMMENT', resp.body)
      res.json(task)
    })
    .catch(err => {
      console.log('ERR FROM PATCHING', err)
      res.end()
    })
    // .catch(next)

    // res.json(task)

  })
  .catch(next)
})
