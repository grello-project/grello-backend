'use strict'

let mongoose = require('mongoose')

let categorySchema = mongoose.Schema({
  name: {type: String, required: true},
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'users'}
})

module.exports = mongoose.model('categories', categorySchema)
