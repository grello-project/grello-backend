'use strict'

let User = require('../model/user.js')
let Task = require('../model/task.js')
let bearerAuth = require('../lib/bearer-auth-middleware')

const Router = require('express').Router

const router = module.exports = new Router()

router.get('/api/tasks', bearerAuth, (req, res, next) => {
  User.findById(req.user._id)
  .populate('tasks')
  .then(user => res.json(user.tasks))
  .catch(next)
})

router.put('/api/tasks/:id', bearerAuth, (req, res, next) => {
  Task.findOneAndUpdate(req.params.id, res.body, {new: true})
  .then(task => res.json(task))
  .catch(next)
})
