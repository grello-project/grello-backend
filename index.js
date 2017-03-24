'use strict'

const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const jsonParser = require('body-parser').json()
const app = express()

const errorMiddleware = require('./lib/httpErrors')

const PORT = process.env.PORT || 3000
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/grello'

mongoose.connect(MONGODB_URI)
mongoose.Promise = Promise //what does this do?

app.use(morgan('dev'))
app.use(jsonParser)
app.use(errorMiddleware)

module.exports = app

if (require.main === module) {
  app.listen(PORT, () => {
    console.log('lisenting on PORT', PORT)
  })
}
