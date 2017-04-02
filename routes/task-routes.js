'use strict'

// const User = require('../model/user.js')
const Task = require('../model/task.js')
const bearerAuth = require('../lib/bearer-auth-middleware')

const Router = require('express').Router

const router = module.exports = new Router()

router.get('/api/tasks', bearerAuth, (req, res, next) => {
  Task.find({userID: req.user._id})
  // .populate('tasks')
  .then(tasks => res.json(tasks))
  .catch(next)
})

router.put('/api/tasks/:id', bearerAuth, (req, res, next) => {
  Task.findByIdAndUpdate(req.params.id, req.body, {new: true})
  .then(task => res.json(task))
  .catch(next)
})
