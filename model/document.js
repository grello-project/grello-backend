'use strict'

let mongoose = require('mongoose')

let documentSchema = mongoose.Schema({
  googleID: {type: String, required: true},
  name: {type: String, required: true},
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
  createdTime: Date,
  modifiedTime: Date,
  link: String
})

module.exports = mongoose.model('documents', documentSchema)
