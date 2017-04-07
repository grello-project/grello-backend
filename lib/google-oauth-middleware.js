'use strict'

const request = require('superagent')

module.exports = function(req, res, next){
  console.log('GETTING GOOGLE USER INFO')
  if(process.env.NODE_ENV === 'testing') {
    req.googleOAUTH = req.body
    return next()
  }

  if (req.query.error){
    req.googleError = new Error(req.query.error)
    return next()
  }

  let data = {
    code: req.query.code,
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    redirect_uri: 'http://ec2-52-11-133-170.us-west-2.compute.amazonaws.com/auth/google/callback',
    grant_type: 'authorization_code',
  }

  let accessToken, refreshToken, tokenTTL
  request.post('https://www.googleapis.com/oauth2/v4/token')
  .type('form')
  .send(data)
  .then(response => {
    accessToken = response.body.access_token
    refreshToken = response.body.refresh_token
    tokenTTL = response.body.expires_in // how long the accessToken token will work in seconds
    return request.get('https://www.googleapis.com/plus/v1/people/me/openIdConnect')
    .set('Authorization', `Bearer ${response.body.access_token}`)
  })
  .then( response => {
    req.googleOAUTH = {
      googleID: response.body.sub,
      name: response.body.given_name,
      email: response.body.email,
      profilePic: response.body.picture,
      accessToken,
      refreshToken,
      tokenTTL,
    }
    next()
  })
  .catch((err) => {
    req.googleError = err
    next()
  })
}
