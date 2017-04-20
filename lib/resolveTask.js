'use strict'

const google = require('googleapis')
const drive = google.drive('v3')
let oauth2Client = require('../lib/oauth2Client')

module.exports = function(task, user) {
  return new Promise((resolve, reject) => {
    oauth2Client.setCredentials({
      access_token: user.accessToken,
      refresh_token: user.refreshToken
    })
    drive.replies.create({
      auth: oauth2Client,
      fileId: task.document,
      commentId: task.googleID,
      fields: 'action,author,content,id',
      resource: {
        action: 'resolve'
      }
    }, (err, res) => {
      if (err) {
        console.error(err)
        reject(err)
      } else {
        console.log('heres the result:', res)
        task.resolved = true
        resolve(task)
      }
    })
  })
}
