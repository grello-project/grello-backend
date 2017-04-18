'use strict'

const google = require('googleapis')
const plus = google.plus('v1')
const User = require('../model/user.js')

let oauth2Client = require('../lib/oauth2Client')

module.exports = function(code) {
  return new Promise((resolve, reject) => {
    oauth2Client.getToken(code, (err, tokens) => {
      if (err) return reject(err)
      oauth2Client.setCredentials(tokens)
      plus.people.get({
        userId: 'me',
        auth: oauth2Client},
        (err, profile) => {
          if (err) return reject(err)
          User
          .findOne({googleID: profile.id})
          .then(user => {
            if (!user) {
              let userData = {
                googleID: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                profilePic: profile.image.url,
                accessToken: tokens.access_token,
                refreshToken: tokens.refresh_token,
                expiration: tokens.expiry_date,
              }
              return new User(userData).save()
            } else {
              console.log('User exists. Updating user.')
              return User.findOneAndUpdate(user._id, { $inc: { timesLoggedIn: 1 } }, { new: true })
            }
          })
          .then(user => {
            console.log('user authenticated and saved/updated:', user)
            resolve(user)
          })
          .catch(err => reject(err))
        })
    })
  })
}
