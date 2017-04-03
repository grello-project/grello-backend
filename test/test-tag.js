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

  beforeEach(done => {

    server = app.listen(PORT)

    new User(mockUser).save()
      .then(user => {
        this.tempUser = user
        return new Tag(mockTag).save()
      })
      .then(tag => {
        tag.user = this.tempUser._id
        return tag.save()
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

  afterEach(done => {
    User.remove({})
    .then(() => Tag.remove({}))
    .then(() => {
      server.close()
      done()
    })
    .catch(done)
  })

  describe('testing POST route',() => {

    after(done => {
      Tag.remove({})
        .then(() => done())
        .catch(done)
    })

    it('should create a new tag', done => {
      request
        .post(`${url}/api/tags`)
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
      request
        .post(`${url}/api/tags`)
        .end((err, res) => {
          expect(res.status).to.equal(401)
          expect(res.text).to.equal('UnauthorizedError')
          done()
        })
    })
    it('should responed 401 if no Token', done => {
      request
        .post(`${url}/api/tags`)
        .set('Authorization', 'Bearer')
        .end((err, res) => {
          expect(res.status).to.equal(401)
          expect(res.text).to.equal('UnauthorizedError')
          done()
        })
    })
    it('should responed 401 if not Bearer', done => {
      request
        .post(`${url}/api/tags`)
        .set('Authorization', 'Basic token')
        .end((err, res) => {
          expect(res.status).to.equal(401)
          expect(res.text).to.equal('UnauthorizedError')
          done()
        })
    })
  })

  describe('testing GET route', () => {

    it('should return an array of tags', done => {
      request
        .get(`${url}/api/tags`)
        .set('Authorization', `Bearer ${this.tempUser.token}`)
        .end((err, res) => {
          expect(res.status).to.equal(200)
          expect(Array.isArray(res.body)).to.equal(true)
          expect(res.body[0].name).to.equal(this.tempTag.name)
          done()
        })
    })
    it('should respond 401 if no Auth header', done => {
      request
        .get(`${url}/api/tags`)
        .end((err, res) => {
          expect(res.status).to.equal(401)
          expect(res.text).to.equal('UnauthorizedError')
          done()
        })
    })
    it('should responed 401 if no Token', done => {
      request
        .get(`${url}/api/tags`)
        .set('Authorization', 'Bearer')
        .end((err, res) => {
          expect(res.status).to.equal(401)
          expect(res.text).to.equal('UnauthorizedError')
          done()
        })
    })
    it('should responed 401 if not Bearer', done => {
      request
        .get(`${url}/api/tags`)
        .set('Authorization', 'Basic token')
        .end((err, res) => {
          expect(res.status).to.equal(401)
          expect(res.text).to.equal('UnauthorizedError')
          done()
        })
    })

  })
})
