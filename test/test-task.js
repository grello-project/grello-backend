'use strict'

const request = require('superagent')
const expect = require('chai').expect

const app = require('../index.js')
const User = require('../model/user.js')
const Task = require('../model/task.js')

const PORT = process.env.PORT || 3000
const API_URL = process.env.API_URL || 'localhost:3000'

const exampleUser = {
  googleID: 'hello12345',
  name: 'ikaika',
  email: 'meow@meow.com'
}

const exampleTask = {
  googleID: 'imatask12345',
  author: 'I ARE AUTHOR',
  comment: 'meow time! dogs suck!'
}

describe('testing task routes', function() {
  let server

  before(done => {
    server = app.listen(PORT, () => console.log('started server from student tests'))

    new User(exampleUser).save()
      .then(user => {
        this.tempUser = user
        return new Task(exampleTask).save()
      })
      .then(task => {
        this.tempTask = task
        this.tempTask.userID = this.tempUser._id
        return this.tempTask.save()
      })
      .then(() => this.tempUser.generateToken())
      .then(token => {
        this.tempUser.token = token
        done()
      })
      .catch(done)
  })

  after(done => {
    User.remove()
    .then(() => Task.remove())
    .then(() => {
      server.close(() => console.log('server closed after task tests'))
      done()
    })
    .catch(done)
  })

  describe('testing unregistered route', () => {
    it('should return 404 for an unregistered route', done => {
      request
        .get(`${API_URL}/api/meow`)
        .end((err, res) => {
          expect(res.status).to.equal(404)
          done()
        })
    })
  })

  describe('testing GET /api/tasks route', () => {
    it('should return all tasks assigned to user', done => {
      request
        .get(`${API_URL}/api/tasks`)
        .set('Authorization', `Bearer ${this.tempUser.token}`)
        .end((err, res) => {
          expect(res.status).to.equal(200)
          expect(Array.isArray(res.body)).to.equal(true)
          expect(res.body[0].comment).to.equal('meow time! dogs suck!')
          done()
        })
    })

    it('should return 401 for unauthenticated user', done => {
      request
        .get(`${API_URL}/api/tasks`)
        .end((err, res) => {
          expect(res.status).to.equal(401)
          expect(res.body).to.deep.equal({})
          done()
        })
    })

    it('should return 500 for malformed token', done => {
      request
        .get(`${API_URL}/api/tasks`)
        .set('Authorization', 'Bearer malformedToken')
        .end((err, res) => {
          expect(res.status).to.equal(500)
          expect(res.body).to.deep.equal({})
          done()
        })
    })
  })

  describe('testing PUT /api/tasks route', () => {
    it('should not add properties to task', done => {
      request
        .put(`${API_URL}/api/tasks/${this.tempTask._id}`)
        .set('Authorization', `Bearer ${this.tempUser.token}`)
        .send({newProperty: 'Hello'})
        .end((err, res) => {
          expect(res.status).to.equal(200)
          expect(res.body.newProperty).to.not.exist
          done()
        })
    })

    it('should return 401 for unauthenticated user', done => {
      request
        .put(`${API_URL}/api/tasks/${this.tempTask._id}`)
        .end((err, res) => {
          expect(res.status).to.equal(401)
          done()
        })
    })

    it('should return 404 when task id not provided', done => {
      request
        .put(`${API_URL}/api/tasks`)
        .set('Authorization', `Bearer ${this.tempUser.token}`)
        .end((err, res) => {
          expect(res.status).to.equal(404)
          done()
        })
    })

    it('should return updated task', done => {
      request
        .put(`${API_URL}/api/tasks/${this.tempTask._id}`)
        .set('Authorization', `Bearer ${this.tempUser.token}`)
        .send({comment: 'take over the world'})
        .end((err, res) => {
          expect(res.status).to.equal(200)
          expect(res.body.comment).to.equal('take over the world')
          expect(res.body.googleID).to.equal('imatask12345')
          expect(res.body.author).to.equal('I ARE AUTHOR')
          done()
        })
    })
  })

})
