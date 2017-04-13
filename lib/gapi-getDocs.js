'use strict'

const google = require('googleapis')

let oauth2Client = require('../lib/gapi-OAuth2')

const drive = google.drive('v3')

function getDocs (user) {
  return new Promise((resolve, reject) => {
    let result = {
      user: user,
      files: []
    }
    let getFileList = (pageToken, pageFn, cb) => {
      oauth2Client.setCredentials({
        access_token: user.accessToken,
        refresh_token: user.refreshToken
      })
      drive.files.list({
        auth: oauth2Client,
        q: 'trashed=false and (\
          mimeType = \'application/vnd.google-apps.document\' or\
          mimeType = \'application/vnd.google-apps.presentation\' or\
          mimeType = \'application/vnd.google-apps.spreadsheet\')',
        fields: 'files(id,name,webViewLink),nextPageToken'
      }, (err, res) => {
        if (err) {
          console.error(err)
          cb(err)
        } else {
          result.files = result.files.concat(res.files)
          if (res.nextPageToken) {
            console.log('Page token', res.nextPageToken)
            pageFn(res.nextPageToken, pageFn, cb)
          } else {
            cb(null, result)
          }
        }
      })
    }
    getFileList(null, getFileList, (err, data) => {
      if (err) {
        return reject(err)
      }
      resolve(data)
    })
  })
}

module.exports = getDocs
