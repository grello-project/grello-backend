'use strict'

const request = require('superagent')
const expect = require('chai').expect

const app = require('../index')
const User = require('../model/user')
const Document = require('../model/document')
const Task = require('../model/task')

const PORT = process.env.PORT || 3000
const API_URL = process.env.API_URL || 'localhost:3000'

const mockGoogleUser = {
  id: 'test id',
  name: 'test google user',
  email: 'test@gmail.com',
  profilePic: 'testpic.png',
  expiration: 1235,
  tokens: {
    access_token: 'testAccessToken',
    refresh_token: 'testRefreshToken'
  }
}

describe('testing gapi routes', function() {
  process.env.NODE_ENV='testing'
  let server

  before(done => {
    server = app.listen(PORT, () => console.log('started server from gapi tests'))
    done()
  })

  after(done => {
    User.remove()
    User.remove({})
    .then(() => Document.remove({}))
    .then(() => Task.remove({}))
    .then(() => {
      server.close(() => console.log('server closed after gapi tests'))
      done()
    })
    .catch(done)
  })

  describe('testing GET /gapi/auth', () => {
    it('should redirect user', done => {
      request
      .get(`${API_URL}/gapi/auth`)
      .send(mockGoogleUser)
      .end((err, res) => {
        expect(res).to.redirect
        done()
      })
    })
  })

  describe('testing GET /gapi/auth/success', () => {
    it('should redirect user', done => {
      request
      .get(`${API_URL}/gapi/auth/success`)
      .send(mockGoogleUser)
      .end((err, res) => {
        expect(res).to.redirect
        done()
      })
    })
  })
})
