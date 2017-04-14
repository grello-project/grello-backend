'use strict'

const Task = require('../model/task')
const Document = require('../model/document')
const bearerAuth = require('../lib/bearer-auth-middleware')

const Router = require('express').Router
const router = module.exports = new Router()

router.get('/api/documents', bearerAuth, (req, res, next) => {
  Document
  .find({user: req.user._id})
  .then(documents => res.json(documents))
  .catch(next)
})
