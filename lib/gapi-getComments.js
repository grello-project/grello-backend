'use strict'

// const Document = require('../model/document')
// const Category = require('../model/category')
// const Task = require('../model/task')
// const uuidV4 = require('uuid/v4')

const google = require('googleapis')

let oauth2Client = require('gapi-OAuth2')

function getComments (results) {
  return new Promise((resolve, reject) => {
    oauth2Client.setCredentials({
      access_token: user.accessToken,
      refresh_token: user.refreshToken
    })

  })
}

module.exports = getComments
