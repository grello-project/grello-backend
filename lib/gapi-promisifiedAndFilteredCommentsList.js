'use strict'

const google = require('googleapis')
const drive = google.drive('v3')
let oauth2Client = require('../lib/gapi-OAuth2')

function getCommentsForFile (file, user) {
  return new Promise((resolve, reject) => {
    let result = {
      user: user,
      file: file.id,
      comments: []
    }

    let getCommentsList = (pageToken, pageFn, cb) => {
      oauth2Client.setCredentials({
        access_token: user.accessToken,
        refresh_token: user.refreshToken
      })

      drive.comments.list({
        auth: oauth2Client,
        pageToken: pageToken,
        fileId: file.id,
        includeDeleted: false,
        fields:
          'comments(\
            author(displayName,emailAddress,photoLink),\
            content,\
            createdTime,\
            deleted,\
            id,\
            modifiedTime,\
            quotedFileContent,\
            replies(id,createdTime,modifiedTime,author,content,deleted,action),\
            resolved),\
          nextPageToken'
      }, (err, res) => {
        if (err) {
          console.error(err)
          cb(err)
        } else {
          console.log('processing comment list results')
          let filteredComments = res.comments.filter( comment => {
            return comment.content.includes(user.email)
          })
          result.comments = result.comments.concat(filteredComments)
          if (res.nextPageToken) {
            console.log('Page token for comments:', res.nextPageToken)
            pageFn(res.nextPageToken, pageFn, cb)
          } else {
            cb(null, result)
          }
        }
      })

    }

    getCommentsList(null, getCommentsList, (err, data) => {
      if (err) {
        return reject(err)
      }
      if (data.comments.length) {
        return resolve(data)
      }
      resolve()
    })

  })
}

module.exports = getCommentsForFile
