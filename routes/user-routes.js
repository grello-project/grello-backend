'use strict'

const User = require('../model/user.js')
const Task = require('../model/task.js')
const Category = require('../model/category.js')
const Tag = require('../model/tag.js')
const Document = require('../model/document.js')
const bearerAuth = require('../lib/bearer-auth-middleware')

const Router = require('express').Router
const router = module.exports = new Router()

router.get('/api/users', bearerAuth, (req, res, next) => {
  User.findById(req.user._id)
  .then(user => {
    user.refreshToken = null
    user.accessToken = null
    user.timeTTL = null
    user.tokenTimestamp = null
    res.json(user)
  })
  .catch(next)
})

router.delete('/api/users', bearerAuth, (req, res, next) => {
  User.findByIdAndRemove(req.user._id)
  .then(() => Task.remove({userID: req.user._id}))
  .then(() => Category.remove({user: req.user._id}))
  .then(() => Tag.remove({user: req.user._id}))
  .then(() => Document.remove({user: req.user._id}))
  .then(() => res.status(204).end())
  .catch(next)
})
