'use strict'

const createError = require('http-errors')
const production = process.env.NODE_ENV === 'production'

module.exports = function(err, req, res, next) {

  if (!production) {
    console.error('msg:', err.message)
    console.error('name:', err.name)
  }

  if (err.status) {
    res.status(err.status).send(err.name)
    next()
    return
  }

  if (err.name === 'ValidationError') {
    err = createError(400, err.message)
    res.status(err.status).send(err.name)
    next()
    return
  }

  if(err.name === 'MongoError') {
    err = createError(409, 'No Duplicates')
    res.status(err.status).send(err.name)
    next()
    return
  }

  err = createError(500, err.message)
  res.status(err.status).send(err.name)
  next()
}
