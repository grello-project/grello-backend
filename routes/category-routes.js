'use strict'

const Category = require('../model/category.js')
const Task = require('../model/task.js')
const bearerAuth = require('../lib/bearer-auth-middleware')
const uuidV4 = require('uuid/v4')

const Router = require('express').Router
const router = module.exports = new Router()

router.post('/api/categories', bearerAuth, (req, res, next) => {
  req.body.user = req.user._id
  let catResult = null
  const category = new Category(req.body)
  category
  .save()
  .then(newCategory => {
    catResult = newCategory
    return new Task({
      googleID: uuidV4(),
      author: 'system',
      category: newCategory._id,
      userID: req.user._id,
      comment: 'placeholder'
    })
    .save()
  })
  .then( () => res.json(catResult))
  .catch(next)
})

router.get('/api/categories', bearerAuth, (req, res, next) => {
  Category.find({user: req.user._id})
  .then(categories => res.json(categories))
  .catch(next)
})

router.put('/api/categories/:id', bearerAuth, (req, res, next) => {
  Category.findByIdAndUpdate(req.params.id, req.body, {new:true})
  .then(category => res.json(category))
  .catch(next)
})

router.delete('/api/categories/:id', bearerAuth, (req, res, next) => {
  Category.findOne({name: 'uncategorized', user: req.user._id})
  .then(category => Task.update({category: req.params.id}, {category: category._id}, {multi: true}))
  .then(() => Category.findByIdAndRemove(req.params.id))
  .then(() => res.status(204).end())
  .catch(next)
})
