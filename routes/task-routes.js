'use strict'

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

router.put('/api/tasks/:id', bearerAuth, (req, res, next) => {
  Task.findByIdAndUpdate(req.params.id, req.body, {new: true})
  .then(task => res.json(task))
  .catch(next)
})

// this route will update our database with data from users drive
router.put('/api/tasks', bearerAuth, refreshToken, (req, res, next) => {
  console.log('WE ARE IN THIS EXTERNAL SYNC ROUTE YO')
  res.end()
})
