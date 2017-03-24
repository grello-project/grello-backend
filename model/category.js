'use strict'

let mongoose = require('mongoose')

let categorySchema = mongoose.Schema({
  name: {type: String, required: true},
  tasks: [{type: mongoose.Schema.Types.ObjectId, ref: 'tasks'}],
})

module.exports = mongoose.model('categories', categorySchema)
