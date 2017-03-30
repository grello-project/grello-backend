'use strict'

let mongoose = require('mongoose')

let tagSchema = mongoose.Schema({
  name: {type: String, required: true, unique: true},
  tasks: [{type: mongoose.Schema.Types.ObjectId, ref: 'tasks'}]
})

module.exports = mongoose.model('tags', tagSchema)
