'use strict'

const google = require('googleapis')
const drive = google.drive('v3')
let oauth2Client = require('../lib/oauth2Client')

function getCommentsForFile (file, user) {
  return new Promise((resolve, reject) => {
    let result = {
      user: user,
      file: file,
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
        if (process.env.NODE_ENV === 'testing') {
          console.log('TESTING ENV IN GETTASKS')
          err = null

          res = {
            comments: [{
              id: 'test comment id',
              googleID: 'test googleID',
              author: {
                displayName: 'test author displayName'
              },
              content: `abc123 contents ${user.email}`,
              resolved: false,
              quotedFileContent: {
                value: 'test quote value'
              },
              createdTime: Date.now(),
              replies: []
            }]
          }

        }
        if (err) {
          console.error(err)
          cb(err)
        } else {
          console.log('ABOUT TO FILTER COMMENTS')
          // console.log('processing comment list results')
          let filteredComments = res.comments.filter( comment => {
            console.log('FILTERING COMMENTS NOW')
            return comment.content.includes(user.email)
          })

          console.log('FILTERED COMMENTS', filteredComments)
          result.comments = result.comments.concat(filteredComments)
          if (res.nextPageToken) {
            // console.log('Page token for comments:', res.nextPageToken)
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
      resolve(data)
    })

  })
}

module.exports = getCommentsForFile
