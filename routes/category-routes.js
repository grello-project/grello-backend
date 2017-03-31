'use strict'

const Category = require('../model/category.js')
const Task = require('../model/task.js')
const bearerAuth = require('../lib/bearer-auth-middleware')

const Router = require('express').Router

const router = module.exports = new Router()

router.post('/api/categories', bearerAuth, (req, res, next) => {
  req.body.user = req.user._id

  const category = new Category(req.body)
  category.save()
  .then(category => res.json(category))
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
  Category.findByIdAndRemove(req.params.id)
  .then(() => Task.find({category: req.params.id}))
  .then(tasks => {
    tasks.forEach(task => {
      Category.findOne({name: 'uncategorized', user: req.user._id})
      .then(category => {
        task.category = category.id
        task.save()
      })
    })

    return
  })
  .then(() => res.status(204).end())
  .catch(next)
})
