'use strict'

let mongoose = require('mongoose')

let categorySchema = mongoose.Schema({
  name: {type: String, required: true},
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
  priority: {type: Number, required: true}
})

module.exports = mongoose.model('categories', categorySchema)
