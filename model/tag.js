'use strict'

let mongoose = require('mongoose')

let tagSchema = mongoose.Schema({
  name: {type: String, required: true},
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'users'}
})

module.exports = mongoose.model('tags', tagSchema)
