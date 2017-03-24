'use strict'

let mongoose = require('mongoose')

let documentSchema = mongoose.Schema({
  googleID: {type: String, required: true, unique: true},
  name: {type: String, required: true}
})

module.exports = mongoose.model('documents', documentSchema)
