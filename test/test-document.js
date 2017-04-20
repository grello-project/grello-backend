'use strict'

const request = require('superagent')
const expect = require('chai').expect

const app = require('../index')
const User = require('../model/user')
const Document = require('../model/document')

const PORT = process.env.PORT || 3000
const API_URL = process.env.API_URL || 'localhost:3000'

const mockUser = {
  googleID: 'hello12345',
  name: 'ikaika',
  email: 'meow@meow.com'
}

const mockDocument = {
  googleID: 'imadocument12345',
  name: 'test document'
}

describe('testing document routes', function() {
  let server

  beforeEach(done => {
    server = app.listen(PORT, () => console.log('started server from document tests'))

    new User(mockUser).save()
      .then(user => {
        this.tempUser = user
        return new Document(mockDocument).save()
      })
      .then(document => {
        this.tempDocument = document
        this.tempDocument.user = this.tempUser._id
        return this.tempDocument.save()
      })
      .then(() => this.tempUser.generateToken())
      .then(token => {
        this.tempUser.token = token
        done()
      })
      .catch(done)
  })

  afterEach(done => {
    User.remove()
    .then(() => Document.remove())
    .then(() => {
      server.close(() => console.log('server closed after document tests'))
      done()
    })
    .catch(done)
  })

  describe('testing GET /api/documents route', () => {
    // router.get('/api/documents', bearerAuth, (req, res, next) => {
    //   Document
    //   .find({user: req.user._id})
    //   .then(documents => res.json(documents))
    //   .catch(next)
    // })

    it('should return user\'s documents', done => {
      request
      .get(`${API_URL}/api/documents`)
      .set('Authorization', `Bearer ${this.tempUser.token}`)
      .end((err, res) => {
        expect(res.status).to.equal(200)
        expect(res.body.length).to.equal(1)
        expect(res.body[0].name).to.equal('test document')
        done()
      })
    })

    it('should return 500 for non-existant user', done => {
      request
      .get(`${API_URL}/api/documents`)
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU4ZjY3YTNiZjU4MTUxMGQ0ODE1ZmU2MCIsImlhdCI6MTQ5MjU0ODE1NX0.s9Lc_TAqQywX6iO8y5MAqAX0gI6wjUHUBKaqIoB6pIc')
      .end((err, res) => {
        expect(res.status).to.equal(500)
        done()
      })
    })

    it('should return 401 for unauthenticated user', done => {
      request
      .get(`${API_URL}/api/documents`)
      .end((err, res) => {
        expect(res.status).to.equal(401)
        expect(res.body).to.deep.equal({})
        done()
      })
    })
  })
})
