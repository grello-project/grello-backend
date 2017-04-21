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
const util = require('util')
const logDirectory = path.join(__dirname, 'log')
const debugDirectory = path.join(__dirname, '/log/debug')
let morganLogs = null

const production = process.env.NODE_ENV === 'production'

// taken from https://github.com/expressjs/morgan docs
// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
fs.existsSync(debugDirectory) || fs.mkdirSync(debugDirectory)

// create a rotating file stream with daily rotation of logs
let accessLogStream = rfs('access.log', {
  interval: '1d',
  path: logDirectory
})

let accessDebugStream = fs.createWriteStream(`${debugDirectory}/consoleLog.txt`, {flags :  'w'})

const errorMiddleware = require('./lib/error-middleware')
const userRoutes = require('./routes/user-routes')
const documentRoutes = require('./routes/document-routes')
const taskRoutes = require('./routes/task-routes')
const categoryRoutes = require('./routes/category-routes')
const tagRoutes = require('./routes/tag-routes')
const gapiRoutes = require('./routes/gapi-routes')
const replyRoutes = require('./routes/reply-routes')

const PORT = process.env.PORT || 3000
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/grello'

mongoose.connect(MONGODB_URI)
mongoose.Promise = Promise //what does this do?


if (production) {
  // using 'combined' APACHE-like logs written to disk for production server
  morganLogs = morgan('combined', {stream: accessLogStream})
  // overriding console logging so it doesn't crash pm2
  console.log = function() {
    accessDebugStream.write(Date().toString() + ' - log: ' + util.format.apply(null, arguments) + '\n')
  }
  console.error = function() {
    accessDebugStream.write(Date().toString() + ' - error: ' + util.format.apply(null, arguments) + '\n')
  }
} else {
  morganLogs = morgan('dev')
}

app.use(morganLogs)
app.use(jsonParser)
app.use(cors())
app.use(gapiRoutes)
app.use(userRoutes)
app.use(documentRoutes)
app.use(taskRoutes)
app.use(categoryRoutes)
app.use(tagRoutes)
app.use(replyRoutes)
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
