'use strict'

let mongoose = require('mongoose')

let documentSchema = mongoose.Schema({
  googleID: {type: String, required: true, unique: true},
  name: {type: String, required: true},
  tasks: [{type: mongoose.Schema.Types.ObjectId, ref: 'tasks'}]
})

module.exports = mongoose.model('documents', documentSchema)
