'use strict'

const Task = require('../model/task')
const bearerAuth = require('../lib/bearer-auth-middleware')
const resolveTask = require('../lib/resolveTask')

const Router = require('express').Router
const router = module.exports = new Router()

router.post('/api/resolve/:id', bearerAuth, (req, res, next) => {
  Task
    .findById(req.params.id)
    .then( task => {
      if (!task) return Promise.reject(new Error('No task found to resolve'))
      return resolveTask(task, req.user)
    })
    .then( resolvedTask => {
      return Task.findByIdAndUpdate(resolvedTask._id, resolvedTask, {new: true})
    })
    .then( result => {
      console.log('final updated task:', result)
      res.json(result)
    })
    .catch(next)
})
