'use strict'

const request = require('superagent')
const expect = require('chai').expect

const app = require('../index')
const User = require('../model/user')
const Task = require('../model/task')

const PORT = process.env.PORT || 3000
const API_URL = process.env.API_URL || 'localhost:3000'

const mockUser = {
  googleID: 'hello12345',
  name: 'ikaika',
  email: 'meow@meow.com'
}

const mockTask = {
  googleID: 'imatask12345',
  author: 'I ARE AUTHOR',
  comment: 'meow time! dogs suck!'
}

describe('testing reply routes', function() {
  let server

  beforeEach(done => {
    server = app.listen(PORT, () => console.log('started server from reply tests'))

    new User(mockUser).save()
    .then(user => {
      this.tempUser = user
      return new Task(mockTask).save()
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

  afterEach(done => {
    User.remove()
    .then(() => Task.remove())
    .then(() => {
      server.close(() => console.log('server closed after reply tests'))
      done()
    })
    .catch(done)
  })

  describe('testings POST /api/resolve/:id', () => {

    it('should return 401 for request without authorization headers', done => {
      request
      .post(`${API_URL}/api/resolve/${this.tempTask._id}`)
      .end((err, res) => {
        expect(res.status).to.equal(401)
        done()
      })
    })

    it('should return 200 for valid task id', done => {
      request
      .post(`${API_URL}/api/resolve/${this.tempTask._id}`)
      .set('Authorization', `Bearer ${this.tempUser.token}`)
      .end((err, res) => {
        expect(res.status).to.equal(200)
        done()
      })
    })

    it('should return 404 for valid invalid task id', done => {
      request
      .post(`${API_URL}/api/resolve/92929292`)
      .set('Authorization', `Bearer ${this.tempUser.token}`)
      .end((err, res) => {
        expect(res.status).to.equal(404)
        done()
      })
    })
  })

})
