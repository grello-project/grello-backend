'use strict'

const Router = require('express').Router
// const request = require('superagent')
const FRONTEND_URL = process.env.WATTLE_URL || 'http://localhost:8080'
const BACKEND_URL = process.env.API_URL || 'http://localhost:3000'

const google = require('googleapis')
const plus = google.plus('v1')
const OAuth2Client = google.auth.OAuth2

const User = require('../model/user.js')

let redirect_url = `${BACKEND_URL}/gapi/auth/success`

let oauth2Client = new OAuth2Client(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  redirect_url
)

let scopes = [
  'openid',
  'email',
  'https://www.googleapis.com/auth/plus.me',
  'https://www.googleapis.com/auth/drive'
]

let url = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
})

const router = module.exports = new Router()

router.get('/gapi/auth', (req, res) => {
  res.redirect(url)
})

router.get('/gapi/auth/success', (req, res) => {
  oauth2Client.getToken(req.query.code, (err, tokens) => {
    if (err) return console.error(err)
    oauth2Client.setCredentials(tokens)
    plus.people.get({userId: 'me', auth: oauth2Client}, (err, profile) => {
      if (err) console.error(err)
      User.findOne({googleID: profile.id})
        .then(user => {
          if (!user) {
            console.log(tokens)
            let userData = {
              googleID: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value,
              profilePic: profile.image.url,
              accessToken: tokens.access_token,
              refreshToken: tokens.refresh_token,
              tokenTimestamp: Date.now() / 1000,
              expiration: tokens.expiry_date,
            }
            user = new User(userData).save()
          }
          return Promise.resolve(user)
        })
        .then(user => user.generateToken())
        .then(token => res.redirect(`${FRONTEND_URL}/#!/join?token=${token}`))
        .catch(err => Promise.reject(err))
    })
  })
})

// { kind: 'plus#person',
//   etag: '"Sh4n9u6EtD24TM0RmWv7jTXojqc/3KRBVQYZroou7WchYPq3cSz5Goo"',
//   gender: 'male',
//   emails: [ { value: 'kyle.winckler@gmail.com', type: 'account' } ],
//   objectType: 'person',
//   id: '104076998173346011157',
//   displayName: 'Kyle Winckler',
//   name: { familyName: 'Winckler', givenName: 'Kyle' },
//   url: 'https://plus.google.com/104076998173346011157',
//   image:
//    { url: 'https://lh5.googleusercontent.com/-23jvsOusgJ8/AAAAAAAAAAI/AAAAAAAAAEk/6uIfpzgPaLs/photo.jpg?sz=50',
//      isDefault: false },
//   placesLived: [ { value: 'Seattle' } ],
//   isPlusUser: true,
//   circledByCount: 27,
//   verified: false,
//   cover:
//    { layout: 'banner',
//      coverPhoto:
//       { url: 'https://lh3.googleusercontent.com/PoHIFmcCv2Mn9kOuQ8-9Mq5-MBIXJN__ZemXxm0Il9JIPjPA9e2WoIndfvwqKDEfd_WEHRU=s630-fcrop64=1,00000f79fffff6b6',
//         height: 587,
//         width: 940 },
//      coverInfo: { topImageOffset: 0, leftImageOffset: 0 } } }
