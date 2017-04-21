'use strict'

const expect = require('chai').expect
const errorMiddleware = require('../lib/error-middleware.js')

function mockRes (){
  const res = {}
  res.status = function(num){
    this.statusCode = num
    return this
  }
  res.send = function(data){
    this.text = data.toString()
    return this
  }
  res.json = function(data){
    this.body = data
    return this
  }

  return res
}

describe('testing error middleware', function(){
  let res
  before(() => res = mockRes())

  describe('should respond with 409 for duplicate conflict in mongo', function(){
    it('should respond with status 409', done => {
      const err = new Error('E11000 duplicate')
      err.name = 'MongoError'
      errorMiddleware(err, {}, res, () => {
        expect(res.statusCode).to.equal(409)
        expect(res.text).to.equal('ConflictError')
        done()
      })
    })
  })
})
