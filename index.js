'use strict'

const dotenv = require('dotenv')
dotenv.load()

const express = require('express')
const mongoose = require('mongoose')
const jsonParser = require('body-parser').json()
const cors = require('cors')
const app = express()

const morgan = require('morgan')
const fs = require('fs')
const path = require('path')
const rfs = require('rotating-file-stream')
const logDirectory = path.join(__dirname, 'log')
let morganLogs = null

const production = process.env.NODE_ENV === 'production'

// taken from https://github.com/expressjs/morgan docs
// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

// create a rotating file stream with daily rotation of logs
let accessLogStream = rfs('access.log', {
  interval: '1d',
  path: logDirectory
})

const errorMiddleware = require('./lib/error-middleware')
const authRoutes = require('./routes/auth-routes')
const userRoutes = require('./routes/user-routes')
const taskRoutes = require('./routes/task-routes')
const categoryRoutes = require('./routes/category-routes')
const tagRoutes = require('./routes/tag-routes')

const PORT = process.env.PORT || 3000
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/grello'

mongoose.connect(MONGODB_URI)
mongoose.Promise = Promise //what does this do?


if (production) {
  // using 'combined' APACHE-like logs written to disk for production server
  morganLogs = morgan('combined', {stream: accessLogStream})
  console.log = function() {
    return
  }
  console.error = function() {
    return
  }
  // http://stackoverflow.com/questions/9024783/how-to-force-node-js-express-js-to-https-when-it-is-running-behind-an-aws-load-b
  // for dealing with AWS ELB
  app.use(function(req, res, next) {
    if((!req.secure) && (req.get('X-Forwarded-Proto') !== 'https')) {
      res.redirect('https://' + req.get('Host') + req.url)
    }
    else
    next()
  })
} else {
  morganLogs = morgan('dev')
}

app.use(morganLogs)
app.use(jsonParser)
app.use(cors())
app.use(authRoutes)
app.use(userRoutes)
app.use(taskRoutes)
app.use(categoryRoutes)
app.use(tagRoutes)
app.use(errorMiddleware)

app.get('/test', (req, res) => {
  res.json({
    'msg': 'hello! things are working great with Wattle.io'
  })
})

module.exports = app

if (require.main === module) {
  app.listen(PORT, () => {
    if (!production) console.log('listening on PORT', PORT)
  })
}
