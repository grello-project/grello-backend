'use strict'

const User = require('../model/user.js')
const Task = require('../model/task.js')
const Category = require('../model/category.js')
const Tag = require('../model/tag.js')
const Document = require('../model/document.js')
const bearerAuth = require('../lib/bearer-auth-middleware')

const Router = require('express').Router
const router = module.exports = new Router()

router.delete('/api/users', bearerAuth, (req, res, next) => {
  User.findByIdAndRemove(req.user._id)
  .then(() => Task.remove({userID: req.user._id}))
  .then(() => Category.remove({user: req.user._id}))
  .then(() => Tag.remove({user: req.user._id}))
  .then(() => Document.remove({user: req.user._id}))
  .then(() => res.status(204).end())
  .catch(next)
})
