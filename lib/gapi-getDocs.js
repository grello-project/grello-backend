'use strict'

// const FRONTEND_URL = process.env.WATTLE_URL || 'http://localhost:8080'
// const BACKEND_URL = process.env.API_URL || 'http://localhost:3000'
//
// const Document = require('../model/document')
// const Category = require('../model/category')
// const Task = require('../model/task')
// const uuidV4 = require('uuid/v4')
const google = require('googleapis')

let oauth2Client = require('../lib/gapi-OAuth2')

const drive = google.drive('v3')

function getDocs (user) {
  console.log('entered getDocs function')
  console.log(user)
  return new Promise((resolve, reject) => {
    oauth2Client.setCredentials({
      access_token: user.accessToken,
      refresh_token: user.refreshToken
    })
    drive.files.list({
      auth: oauth2Client,
      corpora: 'domain',
      spaces: 'drive',
      q: 'trashed = false',
      fields: 'files'
    }, (files, err) => {
      if (err) {
        console.error(err)
        return reject(err)
      }
      console.log(files)
      return resolve()
    })

  })
}

module.exports = getDocs
