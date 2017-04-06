'use strict'

const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const dotenv = require('dotenv')
const jsonParser = require('body-parser').json()
const cors = require('cors')
const app = express()
const fs = require('fs')
const path = require('path')
const rfs = require('rotating-file-stream')
const logDirectory = path.join(__dirname, 'log')
let morganLogs = null
dotenv.load()

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


if (process.env.PRODUCTION) {
  // using 'combined' APACHE-like logs written to disk for production server
  morganLogs = morgan('combined', {stream: accessLogStream})
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
    'msg': 'hello! You have successfully connected to the backend of Wattle.io'
  })
})

module.exports = app

if (require.main === module) {
  app.listen(PORT, () => {
    if (!process.env.PRODUCTION) console.log('listening on PORT', PORT)
  })
}
