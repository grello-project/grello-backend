'use strict'

const app = require('../index')
const request = require('superagent')
const expect = require('chai').expect

const User = require('../model/user')
const Tag = require('../model/tag')

const PORT = process.env.PORT || 3000

process.env.MONGODB_URI = 'mongodb://localhost/devFinal'

const url = 'http://localhost:3000'

const mockUser = {
  googleID: 'testGID',
  name: 'test user',
  email: 'test@test.com'
}

const mockTag = {
  name: 'test tag'
}

describe('tag routes', function() {
  let server

  before(done => {

    server = app.listen(PORT, () => console.log('started server'))

    new User(mockUser).save()
      .then(user => {
        this.tempUser = user
        return new Tag(mockTag).save()
      })
      .then(tag => {
        this.tempTag = tag
        return this.tempUser.save()
      })
      .then(user => user.generateToken())
      .then(token => {
        this.tempUser.token = token
        done()
      })
      .catch(done)
  })

  after(done => {
    User.remove({})
    .then(() => Tag.remove())
    .then(() => {
      server.close(() => console.log('server closed after tag tests'))
      done()
    })
    .catch(done)
  })

  describe('testing POST route',() => {
    it('should create a new tag', done => {
      request.post(`${url}/api/tags`)
      .set('Authorization', `Bearer ${this.tempUser.token}`)
      .send(mockTag)
      .end((err, res) => {
        expect(res.status).to.equal(200)
        expect(res.body.name).to.equal(this.tempTag.name)
        expect(res.body.user).to.equal(this.tempUser._id.toString())
        done()
      })
    })
    it('should respond 401 if no Auth header', done => {
      request.post(`${url}/api/tags`)
      .end((err, res) => {
        expect(res.status).to.equal(401)
        expect(res.text).to.equal('UnauthorizedError')
        done()
      })
    })
    it('should responed 401 if no Token', done => {
      request.post(`${url}/api/tags`)
      .send('Authorization', 'Bearer')
      .end((err, res) => {
        expect(res.status).to.equal(401)
        expect(res.text).to.equal('UnauthorizedError')
        done()
      })
    })
    it('should responed 401 if not Bearer', done => {
      request.post(`${url}/api/tags`)
      .send('Authorization', 'Basic token')
      .end((err, res) => {
        expect(res.status).to.equal(401)
        expect(res.text).to.equal('UnauthorizedError')
        done()
      })
    })
  })
})
