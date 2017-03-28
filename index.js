'use strict'

const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const dotenv = require('dotenv')
const jsonParser = require('body-parser').json()
const passport = require('passport')
const app = express()

dotenv.load()

const errorMiddleware = require('./lib/error-middleware.js')
const authRoutes = require('./routes/auth-routes.js')

const PORT = process.env.PORT || 3000
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/grello'

mongoose.connect(MONGODB_URI)
mongoose.Promise = Promise //what does this do?

require('./lib/passport.js')(passport)

app.use(morgan('dev'))
app.use(jsonParser)
app.use(passport.initialize())
app.use(authRoutes)
app.use(errorMiddleware)

module.exports = app

if (require.main === module) {
  app.listen(PORT, () => {
    console.log('listening on PORT', PORT)
  })
}
