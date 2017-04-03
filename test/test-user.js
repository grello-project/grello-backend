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

describe('testing task routes', function() {
  let server

  beforeEach(done => {
    server = app.listen(PORT, () => console.log('started server from user tests'))

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
      server.close(() => console.log('server closed after user tests'))
      done()
    })
    .catch(done)
  })

  describe('testing DELETE /api/users route', () => {
    it('should return 401 for unauthenticated user', done => {
      request
      .delete(`${API_URL}/api/users`)
      .end((err, res) => {
        expect(res.status).to.equal(401)
        done()
      })
    })

    it('should return 204', done => {
      request
      .delete(`${API_URL}/api/users`)
      .set('Authorization', `Bearer ${this.tempUser.token}`)
      .end((err, res) => {
        expect(res.status).to.equal(204)
        expect(res.body).to.deep.equal({})
        done()
      })
    })
  })
})
