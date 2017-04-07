'use strict'

const Tag = require('../model/tag')
const bearerAuth = require('../lib/bearer-auth-middleware')

const Router = require('express').Router
const tagRouter = module.exports = new Router()

tagRouter.post('/api/tags', bearerAuth, (req, res, next) => {
  req.body.user = req.user._id

  new Tag(req.body).save()
  .then(tag => res.json(tag))
  .catch(next)
})

tagRouter.get('/api/tags', bearerAuth, (req, res, next) => {
  Tag.find({user: req.user._id})
  .then(tags => res.json(tags))
  .catch(next)
})

tagRouter.put('/api/tags/:id', bearerAuth, (req, res, next) => {
  Tag.findByIdAndUpdate(req.params.id, req.body, {new: true})
  .then(tag => res.json(tag))
  .catch(next)
})

tagRouter.delete('/api/tags/:id', bearerAuth, (req, res, next) => {
  Tag.findByIdAndRemove(req.params.id)
  .then(() => res.status(204).end())
  .catch(next)
})
