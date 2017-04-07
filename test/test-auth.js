'use strict'

const request = require('superagent')
const expect = require('chai').expect

const app = require('../index')
const User = require('../model/user')

const PORT = process.env.PORT || 3000
const API_URL = process.env.API_URL || 'localhost:3000'

const mockGoogleUser = {
  googleID: 'test id',
  name: 'test google user',
  email: 'test@gmail.com',
  profilePic: 'testpic.png',
  accessToken: 'testAccessToken',
  refreshToken: 'testRefreshToken',
  tokenTTL: 1,
  tokenTimestamp: 1234,
  expiration: 1235,
}

describe('testing auth routes', function() {
  let server

  before(done => {
    server = app.listen(PORT, () => console.log('started server from auth tests'))
    done()
  })

  after(done => {
    User.remove()
    .then(() => {
      server.close(() => console.log('server closed after auth tests'))
      done()
    })
    .catch(done)
  })

  describe('testing GET /auth/google/callback', () => {
    it('should redirect user', done => {
      request
      .get(`${API_URL}/auth/google/callback`)
      .send(mockGoogleUser)
      .end((err, res) => {
        expect(res).to.redirect
        done()
      })
    })
  })
})
