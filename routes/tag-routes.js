'use strict'

const Router = require('express').Router()
const jsonParser = require('body-parser').json()
const User = require('../model/user')
const Task = require('../model/tag')
const Tag = require('../model/tag')

const tagRouter = module.exports = new Router()

tagRouter.post('/tags', jsonParser, (req, res, next) => {
  Task.findById(req.params.id)
    .then(task => {
      return new Tag(req.body).save()
    })
    .then(tag => {
      
    })

})
