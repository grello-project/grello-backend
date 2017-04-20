'use strict'

const app = require('../index')
const request = require('superagent')
const expect = require('chai').expect

const User = require('../model/user')
const Category = require('../model/category')
const Task = require('../model/task')

const PORT = process.env.PORT || 3000

const url = 'http://localhost:3000'

const mockUser = {
  googleID: 'testGID',
  name: 'test user',
  email: 'test@test.com'
}

const mockCategory = {
  name: 'test category',
  priority: 1
}

const mockTask = {
  googleID: 'imatask12345',
  author: 'I ARE AUTHOR',
  comment: 'meow time! dogs suck!'
}

describe('Testing Category Routes', function() {
  let server

  before(done => {

    server = app.listen(PORT)

    new User(mockUser).save()
      .then(user => {
        this.tempUser = user
        return new Category(mockCategory).save()
      })
      .then(category => {
        category.user = this.tempUser._id
        return category.save()
      })
      .then(category => {
        this.tempCategory = category
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
    .then(() => Category.remove({}))
    .then(() => {
      server.close()
      done()
    })
    .catch(done)
  })

  describe('POST', () => {

    it('should create a new category', done => {
      request
      .post(`${url}/api/categories`)
      .set('Authorization', `Bearer ${this.tempUser.token}`)
      .send(mockCategory)
      .end((err, res) => {
        expect(res.status).to.equal(200)
        expect(res.body.name).to.equal(this.tempCategory.name)
        expect(res.body.user).to.equal(this.tempUser._id.toString())
        done()
      })
    })
    it('should respond 401 if no Auth header', done => {
      request
        .post(`${url}/api/categories`)
        .send(mockCategory)
        .end((err, res) => {
          expect(res.status).to.equal(401)
          expect(res.text).to.equal('UnauthorizedError')
          done()
        })
    })
    it('should respond 401 if no Token', done => {
      request
        .post(`${url}/api/categories`)
        .set('Authorization', 'Bearer')
        .end((err, res) => {
          expect(res.status).to.equal(401)
          expect(res.text).to.equal('UnauthorizedError')
          done()
        })
    })
    it('should respond 401 if not Bearer', done => {
      request
        .post(`${url}/api/categories`)
        .set('Authorization', 'Basic token')
        .end((err, res) => {
          expect(res.status).to.equal(401)
          expect(res.text).to.equal('UnauthorizedError')
          done()
        })
    })
    it('should do something with no body', done => {
      request
        .post(`${url}/api/categories`)
        .set('Authorization', `Bearer ${this.tempUser.token}`)
        .end((err, res) => {
          expect(res.status).to.equal(400)
          expect(res.text).to.equal('BadRequestError')
          done()
        })
    })
  })

  describe('GET', () => {

    it('should return an array of categories', done => {
      request
        .get(`${url}/api/categories`)
        .set('Authorization', `Bearer ${this.tempUser.token}`)
        .end((err, res) => {
          expect(res.status).to.equal(200)
          expect(Array.isArray(res.body)).to.equal(true)
          expect(res.body[0].name).to.equal(this.tempCategory.name)
          done()
        })
    })
    it('should respond 401 if no Auth header', done => {
      request
        .get(`${url}/api/categories`)
        .end((err, res) => {
          expect(res.status).to.equal(401)
          expect(res.text).to.equal('UnauthorizedError')
          done()
        })
    })
    it('should respond 401 if no Token', done => {
      request
        .get(`${url}/api/categories`)
        .set('Authorization', 'Bearer')
        .end((err, res) => {
          expect(res.status).to.equal(401)
          expect(res.text).to.equal('UnauthorizedError')
          done()
        })
    })
    it('should respond 401 if not Bearer', done => {
      request
        .get(`${url}/api/categories`)
        .set('Authorization', 'Basic token')
        .end((err, res) => {
          expect(res.status).to.equal(401)
          expect(res.text).to.equal('UnauthorizedError')
          done()
        })
    })
  })

  describe('PUT', () => {

    it('should return an updated category', done => {
      request
        .put(`${url}/api/categories/${this.tempCategory._id}`)
        .set('Authorization', `Bearer ${this.tempUser.token}`)
        .send({name: 'updated name'})
        .end((err, res) => {
          expect(res.status).to.equal(200)
          expect(res.body.name).to.equal('updated name')
          done()
        })
    })
  })

  describe('DELETE', () => {

    before(done => {
      new Task(mockTask).save()
        .then(task => {
          task.user = this.tempUser._id
          task.category = this.tempCategory._id
          return task.save()
        })
        .then(task => {
          this.tempTask = task
          return this.tempTask.save()
        })
        .then(() => {
          this.uncat = new Category({name: 'uncategorized', user: this.tempUser._id, priority: 1})
          return this.uncat.save()
        })
        .then(() => done())
        .catch(done)
    })

    after(done => {
      Task.remove({})
        .then(() => done())
        .catch(done)
    })

    it('should delete a category', done => {
      request
        .delete(`${url}/api/categories/${this.tempCategory._id}`)
        .set('Authorization', `Bearer ${this.tempUser.token}`)
        .end((err, res) => {
          expect(res.status).to.equal(204)
          done()
        })
    })
    it('should update a tasks category to uncategorized', done => {
      request
        .delete(`${url}/api/categories/${this.tempCategory._id}`)
        .set('Authorization', `Bearer ${this.tempUser.token}`)
        .end((err, res) => {
          Task.findById(this.tempTask._id).
            then(task => {
              expect(res.status).to.equal(204)
              expect(task.category).to.equal(this.uncat._id)
            })
          done()
        })
    })
  })
})
