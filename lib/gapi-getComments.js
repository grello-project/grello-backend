'use strict'

const FRONTEND_URL = process.env.WATTLE_URL || 'http://localhost:8080'
const BACKEND_URL = process.env.API_URL || 'http://localhost:3000'

const Document = require('../model/document')
const Category = require('../model/category')
const Task = require('../model/task')
const uuidV4 = require('uuid/v4')

const google = require('googleapis')

let oauth2Client = require('gapi-OAuth2')

function getComments (documents, user) {
  return new Promise((resolve, reject) => {
    new Category({
      name: 'Uncategorized',
      user: user._id,
      priority: 1
    })
      .save()
      .then( uncatCategory => {
        return new Task({})
      })

  })
}

module.exports = getComments
